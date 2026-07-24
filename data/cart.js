export let cart = [
  {
    productId: '83d4ca15-0f35-48f5-b7a3-1ea210004f2e',
    quantity: 5,
  },
  {
    productId: '54e0eccd-8f36-462b-b68a-8182611d9add',
    quantity: 2,
  },
];

export function addToCart(productId){
 let matchingItem;
  cart.forEach((cartItem)=>{
    if(productId === cartItem.productId){
      matchingItem = cartItem;
    }
  });

  if(matchingItem){
    matchingItem.quantity += 1;
  } else{
    cart.push(
        {
          productId: productId,
          quantity: 1
        });
  }
}

export function removeFromCart(productId){
  const newCart = [];

  cart.forEach((cartItem)=>{
    if(cartItem.productId !== productId){
      newCart.push(cartItem);
    }
  });

  cart = newCart;
}