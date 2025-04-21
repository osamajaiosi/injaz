import PropTypes from "prop-types";
import "./ReviewList.css";

// ⭐ نجمة كاملة أو فارغة
const StarIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill={filled ? "#f6b800" : "#e0e0e0"}
  >
    <path d="M12 2l2.9 6h6.1l-4.95 4.25L17.8 20 12 16.5 6.2 20l1.75-7.75L3 8h6.1z" />
  </svg>
);

StarIcon.propTypes = {
  filled: PropTypes.bool.isRequired,
};

// ⭐ نصف نجمة
const HalfStarIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="26"
    height="26"
    viewBox="0 0 24 24"
  >
    <defs>
      <linearGradient id="halfGradient" x1="1" y1="0" x2="0" y2="0">
        <stop offset="50%" stopColor="#f6b800" />
        <stop offset="50%" stopColor="#e0e0e0" />
      </linearGradient>
    </defs>
    <path
      fill="url(#halfGradient)"
      d="M12 2l2.9 6h6.1l-4.95 4.25L17.8 20 12 16.5 6.2 20l1.75-7.75L3 8h6.1z"
    />
  </svg>
);

// ⭐ توليد النجوم حسب التقييم
const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const stars = [];

  for (let i = 0; i < fullStars; i++)
    stars.push(<StarIcon key={i} filled={true} />);
  if (hasHalf) stars.push(<HalfStarIcon key="half" />);
  while (stars.length < 5)
    stars.push(<StarIcon key={`e${stars.length}`} filled={false} />);

  return <div className="stars-svg">{stars}</div>;
};

StarRating.propTypes = {
  rating: PropTypes.number.isRequired,
};

// ✅ مربع التقييم العام
const RatingOverview = ({ averageRating }) => {
  const percentage = (averageRating / 5) * 100;
  const label =
    averageRating >= 4.5 ? "ممتاز" : averageRating >= 3 ? "جيد" : "متوسط";

  const strokeColor =
    averageRating >= 4.5
      ? "#f6b800"
      : averageRating >= 3
      ? "#ffc107"
      : "#e67e22";

  const circleCircumference = 2 * Math.PI * 45;
  const dashOffset = circleCircumference * (1 - percentage / 100);

  return (
    <div className="rating-box">
      <div className="circle-progress">
        <svg className="progress-ring" width="100" height="100">
          <circle
            className="ring-bg"
            stroke="#eee"
            strokeWidth="6"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
          />
          <circle
            className="ring-fill"
            stroke={strokeColor}
            strokeWidth="6"
            fill="transparent"
            r="45"
            cx="50"
            cy="50"
            strokeDasharray={circleCircumference}
            strokeDashoffset={dashOffset}
            style={{
              "--offset": dashOffset,
            }}
          />
        </svg>
        <div className="rating-text">{averageRating}</div>
      </div>

      {/* النص خارج الدائرة الآن ✅ */}
      <div className="rating-label">{label}</div>
      <div className="label">متوسط التقييم</div>
      <StarRating rating={averageRating} />
    </div>
  );
};

RatingOverview.propTypes = {
  averageRating: PropTypes.number.isRequired,
};

// ✅ القائمة الكاملة للتقييمات
const ReviewList = ({ reviews }) => {
  const average =
    reviews.length > 0
      ? (reviews.reduce((a, b) => a + b.rating, 0) / reviews.length).toFixed(1)
      : 0;

  return (
    <div className="review-wrapper">
      <RatingOverview averageRating={parseFloat(average)} />

      <div className="comments-box">
        {reviews.map((review) => (
          <div className="comment-item" key={review.id}>
            <div className="user-icon">👤</div>
            <div className="comment-body">
              <p className="comment-text">{review.comment}</p>
              <StarRating rating={review.rating} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

ReviewList.propTypes = {
  reviews: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      comment: PropTypes.string.isRequired,
      rating: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default ReviewList;
