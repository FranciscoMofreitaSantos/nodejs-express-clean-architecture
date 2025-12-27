import express from 'express';
import expressLoader from './express';
import mongooseLoader from './mongoose';
import dependencyInjectorLoader from './dependencyInjector';
import config from '../config';
import Logger from './logger';

export default async ({expressApp}: { expressApp: express.Application }) => {
    await mongooseLoader();
    Logger.info('✌️ DB loaded and connected!');


    dependencyInjectorLoader({
        schemas: [
            config.schemas.student,
        ],

        mappers: [
            config.mappers.student,
        ],

        controllers: [
            config.controllers.student.create,
            config.controllers.student.update,
            config.controllers.student.delete,
            config.controllers.student.getAll,
            config.controllers.student.getByEmail,
        ],

        repos: [
            config.repos.student
        ],

        services: [
            config.services.student
        ]
    });

    Logger.info('✌️ DI container loaded');

    await expressLoader({app: expressApp});
    Logger.info('✌️ Express loaded');
};