import { Resolver } from 'type-graphql';

import { BaseExtender } from 'app/libs/baseExtender';
import { Bookings } from '../model/model';
import { BookingsQueries } from './bookingsQueries';
import { BookingsMutations } from './bookingsMutations';

@Resolver(of => Bookings)
export class BikesResolver extends BaseExtender([BookingsQueries, BookingsMutations]) { }
