import { chain } from '@/middlewares/chain';
import { withAuthMiddleware } from '@/middlewares/withAuthMiddleware';
import { withCheckDatabaseMiddleware } from '@/middlewares/withCheckDatabaseMiddleware';

export default chain([withAuthMiddleware, withCheckDatabaseMiddleware]);


export const config = {
 matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images|login|fixDatabase).*)'],
};