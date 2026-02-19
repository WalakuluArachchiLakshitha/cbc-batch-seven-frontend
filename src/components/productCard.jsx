import { Link } from "react-router-dom";

export default function ProductCard(props) {
	const product = props.product;
	const isOutOfStock = product.stock === 0;

	return (
		<div className="w-[300px] h-[400px] shadow-2xl m-3 flex flex-col p-[10px]">
			{/* Image wrapper — relative so the badge can be positioned top-left */}
			<div className="relative w-full h-[250px]">
				<img
					className={`w-full h-full object-cover ${isOutOfStock ? "opacity-60 grayscale" : ""}`}
					src={product.image[0]}
					loading="lazy"
					alt={product.name}
				/>
				{/* Stock badge — top-left corner of the image */}
				{isOutOfStock ? (
					<span className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
						Out of Stock
					</span>
				) : product.stock <= 5 ? (
					<span className="absolute top-2 left-2 bg-amber-500 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
						Only {product.stock} left
					</span>
				) : (
					<span className="absolute top-2 left-2 bg-green-600 text-white text-xs font-bold px-2.5 py-1 rounded-md shadow">
						In Stock
					</span>
				)}
			</div>

			<h1 className="text-xl font-bold text-secondary">{product.name}</h1>
			{
				product.labelPrice > product.price ?
					<div className="flex gap-3 items-center">
						<p className="text-lg text-secondary font-semibold line-through">LKR {product.labelPrice.toFixed(2)}</p>
						<p className="text-lg text-accent font-semibold">LKR {product.price.toFixed(2)}</p>
					</div> :
					<p className="text-lg text-accent font-semibold">LKR {product.price.toFixed(2)}</p>
			}
			<p className="text-sm text-secondary/70">{product.productID}</p>
			<p className="text-sm text-secondary/70">{product.category}</p>

			{/* View Product button — disabled when out of stock */}
			{isOutOfStock ? (
				<span className="w-full h-[30px] mt-[5px] border text-center border-secondary/30 text-secondary/40 cursor-not-allowed flex items-center justify-center text-sm select-none">
					Out of Stock
				</span>
			) : (
				<Link
					to={"/overview/" + product.productID}
					className="w-full h-[30px] mt-[5px] border text-center border-accent text-accent hover:bg-accent hover:text-white flex items-center justify-center"
				>
					View Product
				</Link>
			)}
		</div>
	);
}
