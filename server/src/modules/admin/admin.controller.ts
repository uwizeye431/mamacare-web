import { Response } from 'express';
import { AuthRequest } from '../../middleware/auth.middleware';
import * as AdminModel from './admin.model';

const PAGE_SIZE = 20;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const page = (value: unknown) => Math.max(1, Math.floor(Number(value) || 1));

// Wraps a handler: invalid ids get 400, unexpected errors get a JSON 500 (and are logged)
const handle =
  (fn: (req: AuthRequest, res: Response) => Promise<unknown>) => async (req: AuthRequest, res: Response) => {
    if (req.params.id && !UUID.test(String(req.params.id))) {
      return res.status(400).json({ error: 'Invalid id' });
    }
    try {
      await fn(req, res);
    } catch (error) {
      console.error('Admin API error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

const auditLog = (req: AuthRequest, action: string) =>
  console.log(`Admin action: ${action} (by admin ${req.user?.userId})`);

export const getStats = handle(async (req, res) => {
  res.json(await AdminModel.getStats());
});

export const listUsers = handle(async (req, res) => {
  const search = typeof req.query.search === 'string' ? req.query.search.trim().slice(0, 100) : '';
  const p = page(req.query.page);
  const result = await AdminModel.listUsers(search, PAGE_SIZE, (p - 1) * PAGE_SIZE);
  res.json({ ...result, page: p, pageSize: PAGE_SIZE });
});

// PATCH /users/:id  { role?: 'patient' | 'admin', disabled?: boolean }
export const updateUser = handle(async (req, res) => {
  const id = String(req.params.id);
  const { role, disabled } = req.body ?? {};
  if (role === undefined && disabled === undefined) {
    return res.status(400).json({ error: 'Nothing to update' });
  }
  if (role !== undefined && role !== 'patient' && role !== 'admin') {
    return res.status(400).json({ error: 'Role must be "patient" or "admin"' });
  }
  if (disabled !== undefined && typeof disabled !== 'boolean') {
    return res.status(400).json({ error: '"disabled" must be true or false' });
  }

  const target = await AdminModel.findUser(id);
  if (!target) return res.status(404).json({ error: 'User not found' });

  // Never let an admin lock themselves (or everyone) out
  if (id === req.user!.userId && (role === 'patient' || disabled === true)) {
    return res.status(400).json({ error: 'You cannot remove your own admin access or deactivate yourself.' });
  }
  const losesAdmin = target.role === 'admin' && !target.disabled_at && (role === 'patient' || disabled === true);
  if (losesAdmin && (await AdminModel.countActiveAdmins()) <= 1) {
    return res.status(400).json({ error: 'There must always be at least one active admin.' });
  }

  let user = target;
  if (role !== undefined && role !== target.role) {
    user = await AdminModel.setUserRole(id, role);
    auditLog(req, `set role of user ${id} to ${role}`);
  }
  if (disabled !== undefined && disabled !== Boolean(target.disabled_at)) {
    user = await AdminModel.setUserDisabled(id, disabled);
    auditLog(req, `${disabled ? 'deactivated' : 'reactivated'} user ${id}`);
  }
  res.json({ user });
});

export const deleteUser = handle(async (req, res) => {
  const id = String(req.params.id);
  if (id === req.user!.userId) {
    return res.status(400).json({ error: 'You cannot delete your own account from the admin area.' });
  }
  const target = await AdminModel.findUser(id);
  if (!target) return res.status(404).json({ error: 'User not found' });
  if (target.role === 'admin' && !target.disabled_at && (await AdminModel.countActiveAdmins()) <= 1) {
    return res.status(400).json({ error: 'There must always be at least one active admin.' });
  }
  await AdminModel.deleteUser(id);
  auditLog(req, `deleted user ${id}`);
  res.status(204).end();
});

export const listMessages = handle(async (req, res) => {
  const p = page(req.query.page);
  const result = await AdminModel.listMessages(req.query.status === 'unread', PAGE_SIZE, (p - 1) * PAGE_SIZE);
  res.json({ ...result, page: p, pageSize: PAGE_SIZE });
});

export const updateMessage = handle(async (req, res) => {
  if (typeof req.body?.read !== 'boolean') {
    return res.status(400).json({ error: '"read" must be true or false' });
  }
  const message = await AdminModel.setMessageRead(String(req.params.id), req.body.read);
  if (!message) return res.status(404).json({ error: 'Message not found' });
  res.json({ message });
});

export const deleteMessage = handle(async (req, res) => {
  if (!(await AdminModel.deleteMessage(String(req.params.id)))) {
    return res.status(404).json({ error: 'Message not found' });
  }
  auditLog(req, `deleted contact message ${req.params.id}`);
  res.status(204).end();
});
