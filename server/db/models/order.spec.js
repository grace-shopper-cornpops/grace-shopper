/* global describe beforeEach it */
const {expect} = require('chai')
const db = require('../index')
const Order = db.model('order')
const User = db.model('user')
const Item = db.model('item')
const Address = db.model('address')

describe('Order model', () => {
  beforeEach(async function() {
    await db.sync({force: true})
  })

  describe('create order', () => {
    beforeEach(() => {})
    it('should add an order and respond with the new object', done => {
      Order.create({
        status: 'CREATED',
        recepientFirstName: 'Stacy',
        recepientLastName: 'Satran',
        recepientemail: 'stacy@abc.com'
      })
        .then(order => {
          expect(order.get('status')).to.equal('CREATED')
          expect(order.get('recepientFirstName')).to.equal('Stacy')
          expect(order.get('recepientLastName')).to.equal('Satran')
          expect(order.get('recepientemail')).to.equal('stacy@abc.com')

          done()
        })
        .catch(err => {
          done(err)
        })
    })
  })
  // end describe('create')

  describe('associations', function() {
    /**
     * Add a `belongsTo` relationship between user and order,
     */
    describe('order belongs to user, userId is stored in Order table', () => {
      it('adds belongsTo relationship between user and order', function() {
        const creatingUser = User.create({
          firstName: 'Jill',
          lastName: 'Till',
          telephoneNumber: '877-543-2311',
          email: 'jill_till@hotmail.com',
          password: '8735432311',
          isAdmin: true
        })

        const creatingOrder = Order.create({
          status: 'CREATED',
          total: 1,
          recepientFirstName: 'Stacy',
          recepientLastName: 'Satran',
          recepientemail: 'stacy@abc.com'
        })
        let newuser
        return Promise.all([creatingUser, creatingOrder])
          .then(([createdUser, createdOrder]) => {
            newuser = createdUser
            // this method `setCustomer` method automatically exists if you set up the association correctly
            return createdOrder.setCustomer(createdUser) // tests Order.belongsTo(User, {as: 'customer'})
          })
          .then(order => {
            expect(newuser.id).to.be.equal(order.customerId)
          })
      })
    })
  })

  // describe('hasMany realationship between order and item', () => {
  //   it('adds hasMany realationship between order and item', () => {
  //     // expect()
  //   })
  // })

  let neworder
  describe('belongsToMany realationship between order and item', () => {
    it('adds belongsToMany realationship between order and item through LineItem', done => {
      Order.create({
        status: 'CREATED',
        recepientFirstName: 'Stacy',
        recepientLastName: 'Satran',
        recepientemail: 'stacy@abc.com'
      })
        .then(order => {
          neworder = order
          return Item.create({
            name: 'Ricotta & Yogurt Parfait',
            price: 8.4,
            stock: 300,
            description:
              'Reminiscent of a lemon cheesecake, this healthy breakfast recipe is easy to throw together in the morning. Or stir together the filling in a jar the night before and top with the fruit, nuts and seeds when you get to work.',
            imageUrl:
              'http://images.media-allrecipes.com/userphotos/960x960/4027929.jpg'
          })
        })
        .then(item => {
          return neworder.addItem(item, {through: {quantity: 55, price: 4.44}})
        })
        .then(() => {
          return neworder.getItems()
        })
        .then(items => {
          expect(items.length).to.be.equal(1)
          expect(items[0].lineItem.get('quantity')).to.be.equal(55)
          expect(items[0].lineItem.get('price')).to.be.equal('4.44')

          done()
        })
        .catch(err => {
          console.log(err)
          done(err)
        })
    })
  })
  describe('belongsTo realationship between order and address', () => {
    it('adds belongsTo realationship between order and address', () => {
      const creatingOrder = Order.create({
        status: 'CREATED',
        recepientFirstName: 'Stacy',
        recepientLastName: 'Satran',
        recepientemail: 'stacy@abc.com'
      })

      const creatingAddress = Address.create({
        street1: '444-South 15 Street',
        city: 'Lindenhurtst',
        state: 'NY',
        zip: 11757,
        type: 'shipping'
      })
      let neworder
      return Promise.all([creatingOrder, creatingAddress])
        .then(([createdOrder, createdAddress]) => {
          neworder = createdAddress

          return createdOrder.setAddress(createdAddress) // tests Order.belongsTo(Address)
        })
        .then(order => {
          expect(neworder.id).to.be.equal(order.addressId)
        })
    })
  })
  //  end describe('associations')
})

// end describe('Order model')
