import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
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

const CompletedOrderDetails = () => {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState(null);
  const [requesterInfo, setRequesterInfo] = useState(null);
  const [ratingInfo, setRatingInfo] = useState(null);
  const [complaintInfo, setComplaintInfo] = useState(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [reservedBalance, setReservedBalance] = useState(null);

  useEffect(() => {
    axios
      .get(
        `http://eallaenjazapi.runasp.net/api/Orders/GET_INFO_ORDER_BY_ID_ORDER${id}`
      )
      .then((res) => {
        setOrderDetails(res.data);

        const personId = res.data?.iD_pesron_Presenter_Order;
        if (personId) {
          axios
            .get(
              `http://eallaenjazapi.runasp.net/api/Person/GET_PERSON_PY_ID${personId}`
            )
            .then((res) => setRequesterInfo(res.data));
        }

        axios
          .get(
            `http://eallaenjazapi.runasp.net/api/Rating/GET_RATING_BY_ID_ORDERS${id}`
          )
          .then((res) =>
            setRatingInfo({
              rating: res.data.rating || 0,
              comment: res.data.comment || "لا يوجد تعليق",
            })
          )
          .catch(() =>
            setRatingInfo({
             
            })
          );

        axios
          .get(
            `http://eallaenjazapi.runasp.net/api/Complaints/GET_Complaints_BY_ID_ORDERS${id}`
          )
          .then((res) => setComplaintInfo(res.data))
          .catch(() => setComplaintInfo(null));
      })
      .catch((err) => console.error("فشل في جلب تفاصيل الطلب:", err));
  }, [id]);

  useEffect(() => {
    if (activeStep === 6) {
      axios
        .get(`http://eallaenjazapi.runasp.net/api/Files/GET_ALL_GET_ALL_FILES_BY_ID_ORDERS${id}`)
        .then((res) => setAttachedFiles(res.data))
        .catch((err) => console.error("فشل في جلب الملفات:", err));
    }
  }, [activeStep, id]);

  useEffect(() => {
    if (activeStep === 3) {
      axios
        .get(`http://eallaenjazapi.runasp.net/api/Buyment/GET_INFO_Buyment_By_ID_Orders${id}`)
        .then((res) => setPaymentInfo(res.data))
        .catch((err) => console.error("Buyment error:", err));
      axios
        .get(`http://eallaenjazapi.runasp.net/api/Transaction/GET_ALL_TRANSACTION_BY_ID_ORDERS${id}`)
        .then((res) => setTransactions(res.data))
        .catch((err) => console.error("Transaction error:", err));
      axios
        .get(`http://eallaenjazapi.runasp.net/api/Transaction/GET_Knowing_the_outstanding_balance_in_the_system_By_Id_Order${id}`)
        .then((res) => setReservedBalance(res.data))
        .catch((err) => console.error("Balance error:", err));
    }
  }, [activeStep, id]);

  return (
    <div className="add-service-container">
      <h2 className="section-title-main">تفاصيل الطلب المكتمل</h2>

      <div className="steps-navigation labeled">
        {[1, 2, 3, 4, 5, 6].map((stepNum) => (
          <div
            key={stepNum}
            className="step-item"
            onClick={() => setActiveStep(stepNum)}
          >
            <div className={`circle ${activeStep === stepNum ? "active" : ""}`}>
              {stepNum}
            </div>
            <span className="step-label">
              {
                {
                  1: "معلومات الطلب",
                  2: "معلومات طالب الخدمة",
                  3: "تفاصيل الدفع",
                  4: "التقييم",
                  5: "الشكوى",
                  6: "الملفات المرفقة",
                }[stepNum]
              }
            </span>
          </div>
        ))}
      </div>

      {/* Step 1: Order Info */}
      {activeStep === 1 && orderDetails && (
        <div className="step-content">
          <h3 className="section-title">معلومات الطلب</h3>
          {(() => {
            const Icon =
              iconMap[orderDetails.name_Serves?.trim()] || ChevronLeft;
            return (
              <div className="service-title-center with-icon">
                <Icon size={24} color="#00a300" />
                <span>{orderDetails.titel_serves}</span>
              </div>
            );
          })()}

          <div className="details-grid">
            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-layer-group icon"></i> الخدمة الرئيسية:
              </span>
              <span className="detail-value">{orderDetails.name_Serves}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-sitemap icon"></i> الخدمة الفرعية:
              </span>
              <span className="detail-value">{orderDetails.branch_Serves}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-coins icon"></i> السعر:
              </span>
              <span className="detail-value">{orderDetails.price} دينار</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-clock icon"></i> الوقت المطلوب لانجاز
                الخدمة:
              </span>
              <span className="detail-value">{orderDetails.delivery_time}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-globe icon"></i> يريد المستخدم ان تقدم
                خدمتك:
              </span>
              <span className="detail-value">
                {orderDetails.type_serves === "Online" ? "عن بعد" : "في الموقع"}
              </span>
            </div>

            {orderDetails.type_serves !== "Online" && (
              <div className="detail-item">
                <span className="detail-label">
                  <i className="fas fa-map-marker-alt icon"></i> الموقع:
                </span>
                <span className="detail-value">{orderDetails.location}</span>
              </div>
            )}

            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-calendar-alt icon"></i> تاريخ صدور الطلب:
              </span>
              <span className="detail-value">
                {new Date(orderDetails.date_Order).toLocaleDateString("ar-EG")}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-calendar-check icon"></i> تاريخ قبول الطلب:
              </span>
              <span className="detail-value">
                {new Date(
                  orderDetails.date_acceptance_Order
                ).toLocaleDateString("ar-EG")}
              </span>
            </div>
            {orderDetails.files?.trim() && (
              <div className="detail-item ">
                <span className="detail-label">
                  <i className="fas fa-paperclip icon"></i> الملف المرفق:
                </span>
                <a
                  className="file-download-link"
                  href={orderDetails.files}
                  target="_blank"
                  rel="noreferrer"
                >
                  <i className="fas fa-paperclip"></i> تحميل الملف
                </a>
              </div>
            )}

            <div className="detail-item full">
              <span className="detail-label ">
                <i className="fas fa-info-circle icon"></i> التفاصيل المطلوبة
                للخدمة:
              </span>
              <span className="detail-value">
                {orderDetails.describtion_Serves}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Student Info */}
      {activeStep === 2 && requesterInfo && (
        <div className="step-content">
          <h3 className="section-title">معلومات الطالب</h3>
          <div className="details-grid">
            <div className="detail-item">
              <img
                src={requesterInfo.main_Imege_Url}
                onError={(e) => (e.target.src = "/avatar/avatar.png")}
                alt="الصورة الشخصية"
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "50%",
                  objectFit: "cover",
                }}
              />
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-user icon"></i> الاسم:
              </span>
              <span className="detail-value">
                {(requesterInfo.f_name || "") +
                  " " +
                  (requesterInfo.l_name || "")}
              </span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-venus-mars icon"></i> الجنس:
              </span>
              <span className="detail-value">
                {requesterInfo.gender === "M" ? "ذكر" : "أنثى"}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-envelope icon"></i> البريد الإلكتروني:
              </span>
              <span className="detail-value">{requesterInfo.email}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-phone icon"></i> رقم الهاتف:
              </span>
              <span className="detail-value">{requesterInfo.phone}</span>
            </div>

            {requesterInfo.personal_profile && (
              <div className="detail-item full">
                <span className="detail-label">
                  <i className="fas fa-id-badge icon"></i> نبذة:
                </span>
                <span className="detail-value">
                  {requesterInfo.personal_profile}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step 3: Payment Details */}
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
                  {transactions.map((tx) => (
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
              <div className="balance-summary">
                <span><strong>المبلغ المحجوز/المستحق:</strong></span>
                <span>{reservedBalance} د.أ</span>
              </div>
            </>
          ) : (
            <p>جاري تحميل بيانات الدفع...</p>
          )}
        </div>
      )}

      {/* Step 4: Rating */}
      {activeStep === 4 && (
        <div className="step-content">
          <h3 className="section-title">التقييم</h3>
          {ratingInfo ? (
            <div className="rating-box">
              {/* دائرة التقييم */}
              <div className="circle-progress">
                <svg className="progress-ring" width="100" height="100">
                  <circle
                    stroke="#eee"
                    strokeWidth="6"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                  />
                  <circle
                    stroke="#f6b800"
                    strokeWidth="6"
                    fill="transparent"
                    r="45"
                    cx="50"
                    cy="50"
                    strokeDasharray={2 * Math.PI * 45}
                    strokeDashoffset={
                      2 * Math.PI * 45 * (1 - ratingInfo.rating / 5)
                    }
                  />
                </svg>
                <div className="rating-text">{ratingInfo.rating}</div>
              </div>

              <div className="label">متوسط التقييم</div>

              {/* عرض النجوم */}
              <div className="stars-svg">
                {[1, 2, 3, 4, 5].map((star, idx) => {
                  const filled = ratingInfo.rating >= star;
                  const half =
                    ratingInfo.rating >= star - 0.5 && ratingInfo.rating < star;
                  return (
                    <svg
                      key={idx}
                      xmlns="http://www.w3.org/2000/svg"
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill={
                        filled
                          ? "#f6b800"
                          : half
                          ? "url(#halfGradient)"
                          : "#e0e0e0"
                      }
                    >
                      {half && (
                        <defs>
                          <linearGradient
                            id="halfGradient"
                            x1="1"
                            y1="0"
                            x2="0"
                            y2="0"
                          >
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

              {/* تعليق */}
              <p className="comment-text" style={{ marginTop: "15px" }}>
                <i className="fas fa-comment icon"></i> {ratingInfo.comment}
              </p>
            </div>
          ) : (
            <p>لا يوجد تقييم لهذا الطلب.</p>
          )}
        </div>
      )}

      {/* Step 5: Complaint */}
      {activeStep === 5 && (
        <div className="step-content">
          <h3 className="section-title">الشكوى</h3>
          {complaintInfo ? (
            <div className="details-grid">
              <div className="detail-item full">
                <span className="detail-label">
                  <i
                    className="fas fa-exclamation-circle icon"
                    style={{ color: "red" }}
                  ></i>
                  محتوى الشكوى:
                </span>
                <span className="detail-value">
                  {complaintInfo.description}
                </span>
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
                <span className="detail-value">
                  {complaintInfo.mode_Complaints}
                </span>
              </div>
            </div>
          ) : (
            <p>لا توجد شكاوى مسجلة لهذا الطلب.</p>
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
                    {file.file_Path.split("/").pop()}
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

export default CompletedOrderDetails;
