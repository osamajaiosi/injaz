import { useEffect, useState } from "react";
import axios from "axios";
import Rating from "@mui/material/Rating";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import "./Reviews.css";
import { useAuth } from "../Contexts/AuthContext";

const Reviews = () => {
  const { idStudent } = useAuth();
  const [rating, setRating] = useState(null);
  const [comments, setComments] = useState([]);
  console.log("odstudent= ",idStudent)

  useEffect(() => {
    if (idStudent == null) return;
    const fetchReviews = async () => {
      try {
        
        // Fetch rating
        const ratingRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Rating/Get_Avrge_Rating_Sarves_By_Id_Student ${idStudent}`
        );
        setRating(ratingRes.data);

        // Fetch comments
        const commentsRes = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Rating/Get_Ratings_By_Student_ID${idStudent}`
        );
        setComments(commentsRes.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [idStudent]);

  return (
    <div className="reviews-container">
      <h2>التقييم والمراجعات</h2>
      {rating !== null && (
        <div className="rating-box">
          <div className="rating-circle">{parseFloat(rating).toFixed(1)}</div>
          <div className="rating-label">متوسط التقييمات</div>
          <Rating
            name="read-only"
            value={parseFloat(rating)}
            precision={0.5}
            readOnly
            icon={<StarIcon style={{ color: "#fbc02d" }} fontSize="inherit" />}
            emptyIcon={<StarBorderIcon style={{ color: "#ccc" }} fontSize="inherit" />}
          />
        </div>
      )}
      <hr className="separator-line" />
      <div className="comments-section">
        <h3>التعليقات</h3>
        {comments.length > 0 ? (
          comments.map((c, idx) => (
            <div className="comment-item" key={idx}>
              <p className="comment-text">{c.comment_Text || c.comment}</p>
              <div className="comment-rating">
                <Rating
                  name={`rating-${idx}`}
                  value={c.rating}
                  readOnly
                  precision={0.5}
                  icon={<StarIcon style={{ color: "#fbc02d" }} fontSize="inherit" />}
                  emptyIcon={<StarBorderIcon style={{ color: "#ccc" }} fontSize="inherit" />}
                />
              </div>
            </div>
          ))
        ) : (
          <p>لا توجد تعليقات بعد.</p>
        )}
      </div>
    </div>
  );
};

export default Reviews;
