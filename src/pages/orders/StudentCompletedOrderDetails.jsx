import { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
import {
  BookOpen,
  PenTool,
  Code,
  Calendar,
  Heart,
  Stethoscope,
  Home,
  ShoppingCart,
  Globe,
  Truck,
  Users,
  ChevronLeft,
} from "lucide-react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "./OrdersInbox.css";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const iconMap = {
  تعليمة: BookOpen,
  ابداعية: PenTool,
  تقنية: Code,
  فعاليات: Calendar,
  الرعاية: Heart,
  الصحية: Stethoscope,
  المنزلية: Home,
  التسويق: ShoppingCart,
  الترجمة: Globe,
  النقل: Truck,
  متنوعة: Users,
  مهنية: Users,
};

const StudentCompletedOrderDetails = () => {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState(null);
  const [providers, setProviders] = useState([]);
  const [provLoading, setProvLoading] = useState(false);
  const [ratingInfo, setRatingInfo] = useState(null);
  const [complaintInfo, setComplaintInfo] = useState(null);
  const [newRating, setNewRating] = useState(1);
  const [hoverRating, setHoverRating] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hoverCard, setHoverCard] = useState(false);
  const [hoverBtn, setHoverBtn] = useState(false);
  const [newComplaint, setNewComplaint] = useState("");
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);
  const [hoverComplaintCard, setHoverComplaintCard] = useState(false);
  const [hoverComplaintBtn, setHoverComplaintBtn] = useState(false);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [reservedBalance, setReservedBalance] = useState(null);

  useEffect(() => {
    axios
      .get(`http://eallaenjazapi.runasp.net/api/Orders/GET_INFO_ORDER_BY_ID_ORDER${id}`)
      .then((res) => {
        console.log(id)
        setOrderDetails(res.data);
        const providerId = res.data?.iD_Student_Service_provider;
        if (providerId) {
          setProvLoading(true);
          axios
            .get(
              `http://eallaenjazapi.runasp.net/api/Student_/GET_INFO_FROM_STUDENT_UNVIRSTY_PERSON_USED_SHOW_SERVES_BY_ID_STUDENT${providerId}`
            )
            .then((r) => setProviders([{ ...r.data, studentServiceProviderId: providerId }]))
            .catch((err) => console.error("فشل في جلب مزود الخدمة:", err))
            .finally(() => setProvLoading(false));
        }
        axios
          .get(`http://eallaenjazapi.runasp.net/api/Rating/GET_RATING_BY_ID_ORDERS${id}`)
          .then((r) => setRatingInfo(r.data))
          .catch(() => setRatingInfo(null));
        axios
          .get(`http://eallaenjazapi.runasp.net/api/Complaints/GET_Complaints_BY_ID_ORDERS${id}`)
          .then((r) => setComplaintInfo(r.data))
          .catch(() => setComplaintInfo(null));
      })
      .catch((err) => console.error("فشل في جلب تفاصيل الطلب:", err));
  }, [id]);

  useEffect(() => {
    if (activeStep === 3) {
      axios.get(`http://eallaenjazapi.runasp.net/api/Buyment/GET_INFO_Buyment_By_ID_Orders${id}`)
        .then(res => setPaymentInfo(res.data))
        .catch(console.error);
      axios.get(`http://eallaenjazapi.runasp.net/api/Transaction/GET_ALL_TRANSACTION_BY_ID_ORDERS${id}`)
        .then(res => setTransactions(res.data))
        .catch(console.error);
      axios.get(`http://eallaenjazapi.runasp.net/api/Transaction/GET_Knowing_the_outstanding_balance_in_the_system_By_Id_Order${id}`)
        .then(res => setReservedBalance(res.data))
        .catch(console.error);
    }
  }, [activeStep, id]);

  useEffect(() => {
    if (activeStep === 6) {
      axios
        .get(`http://eallaenjazapi.runasp.net/api/Files/GET_ALL_GET_ALL_FILES_BY_ID_ORDERS${id}`)
        .then((res) => {
          console.log(`Fetched attachedFiles for order ${id}:`, res.data);
          setAttachedFiles(res.data);
        })
        .catch((err) => console.error("فشل في جلب الملفات:", err));
    }
  }, [activeStep, id]);

  const handleSubmitRating = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await axios.post(
        `http://eallaenjazapi.runasp.net/api/Rating/Add_Rating`,
        {
          id: 1,
          rating: newRating,
          comment: newComment,
          ID_Orders: id,
          ID_Serves_Student: 1,
        }
      );
      setRatingInfo({ rating: newRating, comment: newComment });
      toast.success(`تم تقييم الخدمة بنجاح! تعليقك: ${newComment}`);
    } catch (err) {
      console.error("فشل في إرسال التقييم:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setIsSubmittingComplaint(true);
    try {
      const response = await axios.post(
        `http://eallaenjazapi.runasp.net/api/Complaints/Add_Complaints`,
        {
          id: 1,
          orders_ID: id,
          description: newComplaint,
          date: new Date().toISOString(),
          ID_Stute: 1
        }
      );
      setComplaintInfo(response.data);
      toast.success(`تم إرسال الشكوى بنجاح!  `);
    } catch (err) {
      console.error("فشل في إرسال الشكوى:", err);
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  // Styles for dynamic, eye-catching rating form
  const formStyle = {
    background: '#fff',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    padding: '20px',
    borderRadius: '8px',
    maxWidth: '450px',
    margin: '20px auto'
  };
  const textareaStyle = {
    width: '100%',
    height: '100px',
    padding: '10px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    fontSize: '14px',
    resize: 'none',
    marginTop: '8px'
  };
  const buttonStyle = {
    background: '#f6b800',
    color: '#fff',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '4px',
    cursor: 'pointer',
    transition: 'background 0.2s ease, transform 0.2s ease',
    transform: 'scale(1)',
    marginTop: '12px'
  };

  return (
    <div className="add-service-container">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <h2 className="section-title-main">تفاصيل الطلب المكتمل للطالب</h2>
      <div className="steps-navigation labeled">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div
            key={step}
            className="step-item"
            onClick={() => setActiveStep(step)}
          >
            <div className={`circle ${activeStep === step ? "active" : ""}`}>
              {step}
            </div>
            <span className="step-label">
              {{
                1: "معلومات الطلب",
                2: "معلومات مزود الخدمة",
                3: "تفاصيل الدفع",
                4: "التقييم",
                5: "الشكوى",
                6: "الملفات المرفقة",
              }[step]}
            </span>
          </div>
        ))}
      </div>

      {activeStep === 1 && orderDetails && (
        <div className="step-content">
          <h3 className="section-title">معلومات الطلب</h3>
          {(() => {
            const Icon = iconMap[orderDetails.name_Serves?.trim()] || ChevronLeft;
            return (
              <div className="service-title-center with-icon">
                <Icon size={24} color="#00a300" />
                <span>{orderDetails.titel_serves}</span>
              </div>
            );
          })()}
          <div className="details-grid">
            {[
              { label: 'الخدمة الرئيسية', value: orderDetails.name_Serves, icon: 'fas fa-th-large' },
              { label: 'الخدمة الفرعية', value: orderDetails.branch_Serves, icon: 'fas fa-th-list' },
              { label: 'السعر', value: `${orderDetails.price} دينار`, icon: 'fas fa-coins' },
              { label: 'وقت الإنجاز', value: orderDetails.delivery_time, icon: 'fas fa-clock' },
              { label: 'طريقة التقديم', value: orderDetails.type_serves === 'Online' ? 'عن بعد' : 'وجاهي', icon: 'fas fa-globe' },
              ...(orderDetails.files
                ? [{
                    label: 'الملف المرفق',
                    value: (
                      <a href={orderDetails.files} target="_blank" rel="noopener noreferrer" className="file-download-link">
                        <i className="fas fa-paperclip icon"></i> تحميل الملف
                      </a>
                    ),
                    icon: 'fas fa-paperclip',
                  }]
                : []),
            ].map((field, idx) => (
              <div className="detail-item" key={idx}>
                <span className="detail-label"><i className={`${field.icon} icon`}></i> {field.label}:</span>
                <span className="detail-value">{field.value}</span>
              </div>
            ))}
            {orderDetails.describtion_Serves && (
              <div className="detail-item full">
                <span className="detail-label"><i className="fas fa-info-circle icon"></i> التفاصيل:</span>
                <span className="detail-value">{orderDetails.describtion_Serves}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeStep === 2 && (
        <div className="step-content">
          <h3 className="section-title">معلومات مزود الخدمة</h3>
          {provLoading ? (
            <p>جاري تحميل البيانات...</p>
          ) : providers.length > 0 ? (
            <div className="progress-providers-grid">
              {providers.map((prov, idx) => (
                <div key={idx} className="progress-provider-card">
                  <div className="provider-image">
                    <img
                      src={prov.main_Imege_Url || prov.mainImageUrl}
                      onError={(e) => (e.target.src = "/avatar/avatar.png")}
                      alt="مزود الخدمة"
                    />
                  </div>
                  <div className="provider-info">
                    <h3>{`${prov.f_name || prov.fullName} ${prov.l_name || ""}`}</h3>
                    <Link to={`/show-info/${prov.studentServiceProviderId}`} className="provider-link">
                      عرض
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-services">لا توجد بيانات لمزود الخدمة.</p>
          )}
        </div>
      )}

      {activeStep === 3 && (
        <div className="step-content">
          <h3 className="section-title">تفاصيل الدفع</h3>
          {paymentInfo ? (
            <>
              <div className="payment-summary">
                <div className="payment-data-title">بيانات الدفع</div>
                <div><strong>رقم العملية:</strong> {paymentInfo.id}</div>
                <div><strong>المبلغ المدفوع:</strong> {paymentInfo.amount} د.أ</div>
                <div><strong>تاريخ الدفع:</strong> {new Date(paymentInfo.date).toLocaleDateString("ar-EG")}</div>
                <div><strong>طريقة الدفع:</strong> دفع الكتروني</div>
              </div>
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>رقم العملية</th>
                    <th>المبلغ</th>
                    <th>التاريخ</th>
                    <th>الإشراف</th>
                    <th>ملاحظات</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map(tx => (
                    <tr key={tx.id}>
                      <td>{tx.id}</td>
                      <td>{tx.amount} د.أ</td>
                      <td>{new Date(tx.transactionDate).toLocaleDateString("ar-EG")}</td>
                      <td>{tx.supervisedBy}</td>
                      <td>{tx.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="balance-summary"><strong>المبلغ المحجوز حالياً:</strong> {reservedBalance} د.أ</p>
            </>
          ) : (
            <p>جاري تحميل بيانات الدفع...</p>
          )}
        </div>
      )}

      {activeStep === 4 && (
        <div className="step-content">
          <h3 className="section-title">التقييم</h3>
          {ratingInfo ? (
            <div className="rating-box">
              <div className="circle-progress">
                <svg className="progress-ring" width="100" height="100">
                  <circle stroke="#eee" strokeWidth="6" fill="transparent" r="45" cx="50" cy="50" />
                  <circle
                    stroke="#f6b800"
                    strokeWidth="6"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={2 * Math.PI * 45 * (1 - ratingInfo.rating / 5)}
                  />
                </svg>
                <div className="rating-text">{ratingInfo.rating}</div>
              </div>
              <div className="label">متوسط التقييم</div>
              <div className="stars-svg">
                {[1, 2, 3, 4, 5].map((star, idx) => {
                  const filled = ratingInfo.rating >= star;
                  const half = ratingInfo.rating >= star - 0.5 && ratingInfo.rating < star;
                  return (
                    <svg
                      key={idx}
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill={filled ? "#f6b800" : half ? "url(#halfGradient)" : "#e0e0e0"}
                    >
                      {half && (
                        <defs>
                          <linearGradient id="halfGradient" x1="1" y1="0" x2="0" y2="0">
                            <stop offset="50%" stopColor="#f6b800" />
                            <stop offset="50%" stopColor="#e0e0e0" />
                          </linearGradient>
                        </defs>
                      )}
                      <path d="M12 2l2.9 6h6.1l-4.95 4.25L17.8 20 12 16.5 6.2 20l1.75-7.75L3 8h6.1z" />
                    </svg>
                  );
                })}
              </div>
              <p className="comment-text" style={{ marginTop: "15px" }}>
                <i className="fas fa-comment icon"></i> {ratingInfo.comment}
              </p>
            </div>
          ) : isSubmitting ? (
            <p>جاري إرسال التقييم...</p>
          ) : (
            <form
              onSubmit={handleSubmitRating}
              className="rating-form"
              style={{
                ...formStyle,
                transform: hoverCard ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.2s ease-in-out'
              }}
              onMouseEnter={() => setHoverCard(true)}
              onMouseLeave={() => setHoverCard(false)}
            >
              <div className="rating-input" style={{ textAlign: 'center' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>التقييم:</label>
                <div className="stars-svg" style={{ display: 'flex', justifyContent: 'center' }}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <i
                      key={star}
                      className={`${(hoverRating || newRating) >= star ? 'fas' : 'far'} fa-star rating-star`}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setNewRating(star)}
                      style={{
                        cursor: 'pointer',
                        color: (hoverRating || newRating) >= star ? '#f6b800' : '#e0e0e0',
                        margin: '0 6px',
                        fontSize: '32px',
                        transform: hoverRating === star ? 'scale(1.5)' : 'scale(1)',
                        transition: 'transform 0.2s ease'
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="comment-input" style={{ textAlign: 'center' }}>
                <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '8px' }}>التعليق:</label>
                <textarea
                  className="comment-textarea"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  style={textareaStyle}
                />
              </div>
              <button
                type="submit"
                disabled={isSubmitting}
                className="submit-btn"
                style={{
                  ...buttonStyle,
                  transform: hoverBtn ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={() => setHoverBtn(true)}
                onMouseLeave={() => setHoverBtn(false)}
              >
                إرسال
              </button>
            </form>
          )}
        </div>
      )}

      {activeStep === 5 && (
        <div className="step-content">
          <h3 className="section-title">الشكوى</h3>
          {complaintInfo ? (
            <div className="details-grid">
              <div className="detail-item full">
                <span className="detail-label">
                  <i className="fas fa-exclamation-circle icon" style={{ color: "red" }}></i>
                  محتوى الشكوى:
                </span>
                <span className="detail-value">{complaintInfo.description}</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <i className="fas fa-calendar-day icon"></i> تاريخ الشكوى:
                </span>
                <span className="detail-value">
                  {new Date(complaintInfo.date).toLocaleDateString("ar-EG")}
                </span>
              </div>
              <div className="detail-item">
                <span className="detail-label">
                  <i className="fas fa-shield-alt icon"></i> الحالة:
                </span>
                <span className="detail-value">{complaintInfo.mode_Complaints}</span>
              </div>
            </div>
          ) : isSubmittingComplaint ? (
            <p>جاري إرسال الشكوى...</p>
          ) : (
            <form
              onSubmit={handleSubmitComplaint}
              className="complaint-form"
              style={{
                ...formStyle,
                transform: hoverComplaintCard ? 'scale(1.02)' : 'scale(1)',
                transition: 'transform 0.2s ease-in-out'
              }}
              onMouseEnter={() => setHoverComplaintCard(true)}
              onMouseLeave={() => setHoverComplaintCard(false)}
            >
              <label style={{ display: 'block', textAlign: 'center', fontWeight: 'bold', marginBottom: '8px' }}>
                <i className="fas fa-exclamation-circle icon" style={{ color: 'red', marginRight: '8px' }}></i>
                محتوى الشكوى:
              </label>
              <textarea
                className="complaint-textarea"
                value={newComplaint}
                onChange={(e) => setNewComplaint(e.target.value)}
                style={textareaStyle}
              />
              <button
                type="submit"
                disabled={isSubmittingComplaint}
                style={{
                  ...buttonStyle,
                  background: 'red',
                  transform: hoverComplaintBtn ? 'scale(1.05)' : 'scale(1)'
                }}
                onMouseEnter={() => setHoverComplaintBtn(true)}
                onMouseLeave={() => setHoverComplaintBtn(false)}
              >
                إرسال الشكوى
              </button>
            </form>
          )}
        </div>
      )}

      {activeStep === 6 && (
        <div className="step-content">
          <h3 className="section-title">الملفات المرفقة</h3>
          {attachedFiles.length > 0 ? (
            <div className="files-grid">
              {attachedFiles.map((file) => (
                <div key={file.id} className="file-card">
                  <a
                    href={file.file_Path}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="file-link"
                  >
                    <i className="fas fa-paperclip icon"></i>{" "}
                    {file.file_Path.split('/').pop()}
                  </a>
                  <p className="file-desc">
                    {file.description || "لم يتم اضافة وصف لهذا الملف"}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>لا توجد ملفات مرفقة.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentCompletedOrderDetails;
