import { Resolver } from 'type-graphql';

import { BaseExtender } from 'app/libs/baseExtender';
import { Bikes } from '../model/model';
import { BikesQueries } from './bikesQueries';
import { BikesMutations } from './bikesMutations';

@Resolver(of => Bikes)
export class BikesResolver extends BaseExtender([BikesQueries, BikesMutations]) { }
