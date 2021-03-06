/**
 * `components/index.js` exists simply as a 'central export' for our components.
 * This way, we can import all of our components from the same place, rather than
 * having to figure out which file they belong to!
 */
export {default as Navbar} from './navbar'
export {default as Footer} from './footer'
export {default as Home} from './home'
export {Login, Signup} from './auth-form'
export {default as Cart} from './cart'
export {default as SingleItem} from './singleItem'
export {default as Register} from './register'
export {default as ItemCard} from './itemCard'
export {default as CartItem} from './cartItem'
export {default as CheckoutForm} from './checkout-form'
