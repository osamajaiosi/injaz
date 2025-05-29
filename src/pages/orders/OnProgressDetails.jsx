import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../Contexts/AuthContext";
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

const OnProgressDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { idStudent: studentId } = useAuth();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
  const [activeStep, setActiveStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState(null);
  const [requesterInfo, setRequesterInfo] = useState(null);
  const [showFileModal, setShowFileModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileDescription, setFileDescription] = useState("");
  const [fileUploadError, setFileUploadError] = useState("");
  const [submittingFile, setSubmittingFile] = useState(false);
  const fileInputRef = useRef(null);
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [reservedBalance, setReservedBalance] = useState(null);

  useEffect(() => {
    axios
      .get(`http://eallaenjazapi.runasp.net/api/Orders/GET_INFO_ORDER_BY_ID_ORDER${id}`)
      .then((res) => {
        setOrderDetails(res.data);
        console.log(id);
        const personId = res.data?.iD_pesron_Presenter_Order;
        if (personId) {
          axios
            .get(`http://eallaenjazapi.runasp.net/api/Person/GET_PERSON_PY_ID${personId}`)
            .then((res) => setRequesterInfo(res.data));
        }
      })
      .catch((err) => console.error("فشل في جلب تفاصيل الطلب:", err));
  }, [id]);

  useEffect(() => {
    if (activeStep === 3 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeStep, messages]);

  useEffect(() => {
    if (activeStep === 5) {
      axios
        .get(`http://eallaenjazapi.runasp.net/api/Files/GET_ALL_GET_ALL_FILES_BY_ID_ORDERS${id}`)
        .then((res) => setAttachedFiles(res.data))
        .catch((err) => console.error("فشل في جلب الملفات:", err));
    }
  }, [activeStep, id]);

  useEffect(() => {
    if (activeStep === 6) {
      axios.get(`http://eallaenjazapi.runasp.net/api/Buyment/GET_INFO_Buyment_By_ID_Orders${id}`)
        .then(res => setPaymentInfo(res.data))
        .catch(err => console.error("Payment info error:", err));
      axios.get(`http://eallaenjazapi.runasp.net/api/Transaction/GET_ALL_TRANSACTION_BY_ID_ORDERS${id}`)
        .then(res => setTransactions(res.data))
        .catch(err => console.error("Transactions error:", err));
      axios.get(`http://eallaenjazapi.runasp.net/api/Transaction/GET_Knowing_the_outstanding_balance_in_the_system_By_Id_Order${id}`)
        .then(res => setReservedBalance(res.data))
        .catch(err => console.error("Reserved balance error:", err));
    }
  }, [activeStep, id]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Chat_Messages/Get_All_Message_By_Id_Order${id}`
        );
        const msgs = res.data.map((msg) => ({
          sender: msg.sender_ID === studentId ? 'user' : 'provider',
          text: msg.message_Text,
          time: new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setMessages(msgs);
      } catch (err) {
        console.error('فشل في جلب الرسائل:', err);
      }
    };
    fetchMessages();
  }, [id, studentId]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;
    const payload = {
      message_Text: newMessage,
      ID_Order: parseInt(id),
      ID_Serves_Provider: studentId,
      ID_Person_Presnter: orderDetails?.iD_pesron_Presenter_Order,
      date: new Date().toISOString(),
      sender_ID: studentId,
    };
    try {
      const res = await axios.post(
        "http://eallaenjazapi.runasp.net/api/Chat_Messages/ADD_message",
        payload
      );
      const newMsg = {
        sender: 'user',
        text: res.data.message_Text,
        time: new Date(res.data.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, newMsg]);
      setNewMessage("");
    } catch (err) {
      console.error("فشل في إرسال الرسالة:", err);
    }
  };

  const completeOrder = () => {
    axios
      .put(
        `http://eallaenjazapi.runasp.net/api/Orders/Update_Order_and_Enrool_Data_Complete_Order${id}`
      )
      .then(() => navigate("/completed-orders"))
      .catch((err) => console.error("فشل في إنهاء الطلب:", err));
  };

  return (
    <div className="add-service-container">
      <h2 className="section-title-main">تفاصيل الطلب الجاري العمل عليه</h2>

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
              {{
                1: "معلومات الطلب",
                2: "معلومات طالب الخدمة",
                3: "التواصل مع طالب الخدمة",
                4: "إنهاء الطلب",
                5: "الملفات المرفقة",
                6: "تفاصيل الدفع",
              }[stepNum]}
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
                <i className="fas fa-clock icon"></i> الوقت المطلوب لانجاز الخدمة:
              </span>
              <span className="detail-value">{orderDetails.delivery_time}</span>
            </div>

            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-globe icon"></i> يريد المستخدم ان تقدم خدمتك:
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
                  <i className="fas fa-paperclip icon"></i> تحميل الملف
                </a>
              </div>
            )}

            <div className="detail-item full">
              <span className="detail-label">
                <i className="fas fa-info-circle icon"></i> التفاصيل المطلوبة للخدمة:
              </span>
              <span className="detail-value">{orderDetails.describtion_Serves}</span>
            </div>
          </div>
        </div>
      )}

      {activeStep === 2 && requesterInfo && (
        <div className="step-content">
          <h3 className="section-title">معلومات طالب الخدمة</h3>
          <div className="details-grid">
            <div className="detail-item">
              <img
                src={requesterInfo.main_Imege_Url}
                onError={(e) => (e.target.src = "/avatar/avatar.png")}
                alt="الصورة الشخصية"
                style={{ width: "100px", height: "100px", borderRadius: "50%", objectFit: "cover" }}
              />
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-user icon"></i> الاسم:
              </span>
              <span className="detail-value">
                {`${requesterInfo.f_name || ""} ${requesterInfo.l_name || ""}`}
              </span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-venus-mars icon"></i> الجنس:
              </span>
              <span className="detail-value">{requesterInfo.gender === "M" ? "ذكر" : "أنثى"}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-envelope icon"></i> البريد الإلكتروني:
              </span>
              <span className="detail-value">{requesterInfo.email}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">
                <i className="fas fa-phone icon"></i> الهاتف:
              </span>
              <span className="detail-value">{requesterInfo.phone}</span>
            </div>
            {requesterInfo.personal_profile && (
              <div className="detail-item full">
                <span className="detail-label">
                  <i className="fas fa-id-badge icon"></i> نبذة:
                </span>
                <span className="detail-value">{requesterInfo.personal_profile}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeStep === 3 && (
        <div className="step-content chat-step">
          <h3 className="section-title">التواصل مع طالب الخدمة</h3>
          <div className="chat-container" ref={chatContainerRef}>
            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.sender}`}>
                <div className="message-text">{msg.text}</div>
                <div className="message-time">{msg.time}</div>
              </div>
            ))}
          </div>
          <div className="chat-input-container">
            <input
              type="text"
              className="chat-input"
              placeholder="اكتب رسالتك هنا"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSend(); }}
            />
          </div>
          <div className="chat-actions">
            <button className="chat-action-btn send-btn" onClick={handleSend}>
              <i className="fas fa-paper-plane"></i> إرسال
            </button>
            <div className="chat-middle-space" />
            <button className="chat-action-btn attach-btn" onClick={() => fileInputRef.current && fileInputRef.current.click()}>
              <i className="fas fa-paperclip"></i> إرفاق ملف
            </button>
          </div>
          <input
            type="file"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={(e) => {
              const file = e.target.files[0];
              if (file) {
                setSelectedFile(file);
                setShowFileModal(true);
              }
            }}
          />
          {showFileModal && (
            <div className="confirm-modal">
              <div className="modal-content">
                <h3>أضف تفاصيل عن الملف المرفق</h3>
                <p>الملف: {selectedFile.name}</p>
                <input
                  type="text"
                  placeholder="وصف الملف"
                  value={fileDescription}
                  onChange={(e) => setFileDescription(e.target.value)}
                />
                {fileUploadError && <p className="error-message">{fileUploadError}</p>}
                <div className="modal-buttons">
                  <button
                    onClick={async () => {
                      setSubmittingFile(true);
                      setFileUploadError("");
                      try {
                        const form = new FormData();
                        form.append("file", selectedFile);
                        await axios.post(
                          `http://eallaenjazapi.runasp.net/api/Files/UploadFile_from_connection?ID_order=${id}&Description=${encodeURIComponent(
                            fileDescription
                          )}`,
                          form,
                          { headers: { "Content-Type": "multipart/form-data" } }
                        );
                        setShowFileModal(false);
                      } catch (err) {
                        console.error("فشل رفع الملف:", err);
                        setFileUploadError("فشل رفع الملف. حاول مرة أخرى.");
                      } finally {
                        setSubmittingFile(false);
                      }
                    }}
                    disabled={submittingFile}
                  >
                    {submittingFile ? "جارٍ الإرسال..." : "إرسال"}
                  </button>
                  <button
                    onClick={() => {
                      setShowFileModal(false);
                      setSelectedFile(null);
                      setFileDescription("");
                      setFileUploadError("");
                    }}
                  >
                    إلغاء
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeStep === 4 && (
        <div className="step-content">
          <h3 className="section-title">إنهاء الطلب</h3>
          <div className="review-buttons">
            <button className="select-button" onClick={completeOrder}>
              إنهاء الطلب
            </button>
          </div>
        </div>
      )}

      {activeStep === 5 && (
        <div className="step-content">
          <h3 className="section-title">الملفات المرفقة</h3>
          {attachedFiles.length > 0 ? (
            <div className="files-grid">
              {attachedFiles.map((file) => (
                <div key={file.id} className="file-card">
                  <a href={file.file_Path} target="_blank" rel="noopener noreferrer" className="file-link">
                    <i className="fas fa-paperclip icon"></i> {file.file_Path.split('/').pop()}
                  </a>
                  <p className="file-desc">{file.description || "لم يتم اضافة وصف لهذا الملف"}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>لا توجد ملفات مرفقة.</p>
          )}
        </div>
      )}

      {activeStep === 6 && (
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
    </div>
  );
};

export default OnProgressDetails;
