import { CiCircleChevDown, CiCircleChevUp } from "react-icons/ci";
import { addToCart, getTotal, loadCart } from "../utils/cart";
import { BiTrash } from "react-icons/bi";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function CartPage() {

    const [cart, setCart] = useState(loadCart())

    return (
        <div className="w-full lg:h-[calc(100vh-100px)] bg-primary flex flex-col pt-[25px] items-center mt-20 pb-20">
            <div className="w-full max-w-[600px] px-4 flex flex-col gap-4">
                {cart.map((item, index) => {
                    return (
                        <div key={index} className="w-full bg-white flex flex-col lg:flex-row relative items-center p-4 rounded-xl shadow-sm border border-secondary/10">
                            {/* Delete Button - Positioned top-right on mobile */}
                            <button className="absolute top-2 right-2 lg:top-1/2 lg:-right-12 lg:-translate-y-1/2 text-red-500 text-xl lg:text-2xl rounded-full p-2 hover:bg-red-50 transition-colors" onClick={
                                () => {
                                    addToCart(item, -item.quantity)
                                    setCart(loadCart())
                                }
                            }><BiTrash /></button>

                            <img className="h-[100px] w-[100px] lg:h-full lg:w-[120px] object-cover rounded-lg" src={item.image} />

                            <div className="w-full text-center lg:text-left lg:w-[200px] flex flex-col gap-1 mt-2 lg:mt-0 lg:pl-4">
                                <h1 className="font-bold text-secondary text-lg leading-tight">{item.name}</h1>
                                <span className="text-xs text-secondary/60">PID: {item.productID}</span>
                            </div>

                            <div className="w-full lg:w-auto flex flex-row lg:flex-col justify-center items-center gap-3 my-3 lg:my-0 lg:ml-auto">
                                <CiCircleChevUp className="text-3xl text-secondary hover:text-accent cursor-pointer transition-colors" onClick={
                                    () => {
                                        addToCart(item, 1)
                                        setCart(loadCart())
                                    }
                                } />
                                <span className="font-bold text-xl text-secondary">{item.quantity}</span>
                                <CiCircleChevDown className="text-3xl text-secondary hover:text-accent cursor-pointer transition-colors" onClick={() => {
                                    addToCart(item, -1)
                                    setCart(loadCart())
                                }} />
                            </div>

                            <div className="w-full lg:w-[150px] flex flex-col items-center lg:items-end justify-center">
                                {
                                    item.labelPrice > item.price &&
                                    <span className="text-secondary/50 line-through text-sm">LKR {item.labelPrice.toFixed(2)}</span>
                                }
                                <span className="font-bold text-accent text-xl">LKR {(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    );
                })}
                {cart.length > 0 && (
                    <div className="w-full bg-white p-4 rounded-xl shadow-sm border border-secondary/10 flex flex-col md:flex-row justify-between items-center gap-4">
                        <span className="font-bold text-secondary text-xl">Total: <span className="text-accent">LKR {getTotal().toFixed(2)}</span></span>
                        <Link state={cart} to="/checkout" className="w-full md:w-auto bg-accent text-white px-8 py-3 rounded-xl font-bold hover:bg-accent/80 transition-all text-center">
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
