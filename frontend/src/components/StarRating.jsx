import { useState } from "react";
import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, onRate, editable = false }) => {
    const [hover, setHover] = useState(null);

    return (
        <div className="flex items-center">
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                return (
                    <label key={index} className="cursor-pointer">
                        <input
                            type="radio"
                            name="rating"
                            className="hidden"
                            value={ratingValue}
                            onClick={() => editable && onRate(ratingValue)}
                        />
                        <FaStar
                            className="transition-colors duration-200"
                            color={ratingValue <= (hover || rating) ? "#fbbf24" : "#e5e7eb"} // Gold vs Gray
                            size={20}
                            onMouseEnter={() => editable && setHover(ratingValue)}
                            onMouseLeave={() => editable && setHover(null)}
                        />
                    </label>
                );
            })}
        </div>
    );
};

export default StarRating;