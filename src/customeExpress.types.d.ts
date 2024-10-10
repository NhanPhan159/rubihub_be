import { UserDetails } from './contracts';

declare global {
    namespace Express {
        interface Request {
            user: UserDetails;
        }
    }
}
