import { Resolver } from 'type-graphql';

import { BaseExtender } from 'app/libs/baseExtender';
import { User } from '../model/model';
import { UserQueries } from './userQueries';
import { UserMutations } from './userMutations';

@Resolver(of => User)
export class UserResolver extends BaseExtender([UserQueries, UserMutations]) { }
