export default function Card({ title, description, onEditClick, imageUrl, isDashboard, showEditDeleteButtons, onDeleteClick, onBuyClick }) {
    return (
        <div className="card">
            {/* Show product image if available, else a placeholder */}
            <img
                src={imageUrl || '/no-image-placeholder.png'} // Use placeholder if no image is available
                alt={title}
                className="card-image"
            />
            <h3>{title}</h3>
            <p>{description}</p>

            {/* Show "Buy" button only on Dashboard */}
            {isDashboard && (
                <button onClick={onBuyClick}>Buy</button>
            )}

            {/* Show Edit/Delete buttons for other pages */}
            {showEditDeleteButtons && (
                <>
                    <button onClick={onEditClick}>Edit</button>
                    <button onClick={onDeleteClick}>Delete</button>
                </>
            )}
        </div>
    );
}
