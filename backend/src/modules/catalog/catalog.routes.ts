import { FastifyInstance } from 'fastify';
import { requireAuth, requireRole } from '../auth/auth.middleware.js';
import {
  catalogIdSchema,
  createCatalogProjectSchema,
  createCourseSchema
} from './catalog.schema.js';

function slugify(title: string) {
  return `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70)}-${Date.now().toString(36)}`;
}

const adminOnly = [requireAuth, requireRole('admin', 'super_admin')];

export async function catalogRoutes(fastify: FastifyInstance) {
  fastify.get('/courses', async (_request, reply) => {
    const courses = await fastify.prisma.catalogCourse.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });
    return reply.header('Cache-Control', 'no-store').send({ courses });
  });

  fastify.get('/projects', async (_request, reply) => {
    const projects = await fastify.prisma.catalogProject.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' }
    });
    return reply.header('Cache-Control', 'no-store').send({ projects });
  });

  fastify.get('/admin', { preHandler: adminOnly }, async (_request, reply) => {
    const [courses, projects] = await Promise.all([
      fastify.prisma.catalogCourse.findMany({ orderBy: { createdAt: 'desc' } }),
      fastify.prisma.catalogProject.findMany({ orderBy: { createdAt: 'desc' } })
    ]);
    return reply.send({ courses, projects });
  });

  fastify.post('/courses', { preHandler: adminOnly }, async (request, reply) => {
    const body = createCourseSchema.parse(request.body);
    const course = await fastify.prisma.catalogCourse.create({
      data: {
        ...body,
        badge: body.badge || null,
        slug: slugify(body.title),
        creatorId: request.user!.id
      }
    });
    return reply.code(201).send({ course });
  });

  fastify.post('/projects', { preHandler: adminOnly }, async (request, reply) => {
    const body = createCatalogProjectSchema.parse(request.body);
    const project = await fastify.prisma.catalogProject.create({
      data: {
        ...body,
        free: body.free || body.price === 0,
        slug: slugify(body.title),
        creatorId: request.user!.id
      }
    });
    return reply.code(201).send({ project });
  });

  fastify.delete('/courses/:id', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = catalogIdSchema.parse(request.params);
    await fastify.prisma.catalogCourse.delete({ where: { id } });
    return reply.code(204).send();
  });

  fastify.delete('/projects/:id', { preHandler: adminOnly }, async (request, reply) => {
    const { id } = catalogIdSchema.parse(request.params);
    await fastify.prisma.catalogProject.delete({ where: { id } });
    return reply.code(204).send();
  });
}
