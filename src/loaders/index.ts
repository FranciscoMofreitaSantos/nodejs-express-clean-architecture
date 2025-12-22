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

        ],

        mappers: [

        ],

        controllers: [




        ],
        repos: [

        ],
        services: [

        ]
    });

    Logger.info('✌️ DI container loaded');

    await expressLoader({app: expressApp});
    Logger.info('✌️ Express loaded');
};