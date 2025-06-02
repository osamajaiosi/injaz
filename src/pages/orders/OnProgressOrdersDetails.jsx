import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, Link } from "react-router-dom";
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

const OnProgressOrdersDetails = () => {
  const { id } = useParams();
  const { idPerson } = useAuth();
  const [activeStep, setActiveStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState(null);
  const [providers, setProviders] = useState([]);
  const [provLoading, setProvLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef(null);
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

  const handleSend = async () => {
    if (newMessage.trim() === "") return;
    const payload = {
      message_Text: newMessage,
      ID_Order: parseInt(id),
      ID_Serves_Provider: orderDetails?.iD_Student_Service_provider,
      ID_Person_Presnter: idPerson,
      date: new Date().toISOString(),
      sender_ID: idPerson,
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

  useEffect(() => {
    axios
      .get(`http://eallaenjazapi.runasp.net/api/Orders/GET_INFO_ORDER_BY_ID_ORDER${id}`)
      .then((res) => {
        setOrderDetails(res.data);
        const providerId = res.data?.iD_Student_Service_provider;
        if (providerId) {
          setProvLoading(true);
          axios
            .get(
              `http://eallaenjazapi.runasp.net/api/Student_/GET_INFO_FROM_STUDENT_UNVIRSTY_PERSON_USED_SHOW_SERVES_BY_ID_STUDENT${providerId}`
            )
            .then((r) =>
              setProviders([{ ...r.data, studentServiceProviderId: providerId }])
            )
            .catch((err) => console.error("فشل في جلب مزود الخدمة:", err))
            .finally(() => setProvLoading(false));
        }
      })
      .catch((err) => console.error("فشل في جلب تفاصيل الطلب:", err));
  }, [id]);

  // جلب جميع الرسائل باستخدام API
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `http://eallaenjazapi.runasp.net/api/Chat_Messages/Get_All_Message_By_Id_Order${id}`
        );
        const personId = 1; // معرف المرسل (المستخدم) مؤقت
        const msgs = res.data.map((msg) => ({
          sender: msg.sender_ID === personId ? 'user' : 'provider',
          text: msg.message_Text,
          time: new Date(msg.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        }));
        setMessages(msgs);
      } catch (err) {
        console.error('فشل في جلب الرسائل:', err);
      }
    };
    fetchMessages();
  }, [id]);

  useEffect(() => {
    if (activeStep === 5) {
      axios
        .get(`http://eallaenjazapi.runasp.net/api/Files/GET_ALL_GET_ALL_FILES_BY_ID_ORDERS${id}`)
        .then((res) => setAttachedFiles(res.data))
        .catch((err) => console.error("فشل في جلب الملفات:", err));
    }
  }, [activeStep, id]);

  useEffect(() => {
    if (activeStep === 3) {
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

  // Scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Scroll to bottom when switching to chat step
  useEffect(() => {
    if (activeStep === 4 && chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [activeStep]);

  return (
    <div className="add-service-container">
      <h2 className="section-title-main">تفاصيل الطلب جاري العمل عليه لطالب الخدمة</h2>
      <div className="steps-navigation labeled">
        {[1, 2, 3, 4, 5].map((step) => (
          <div
            key={step}
            className="step-item"
            onClick={() => setActiveStep(step)}
          >
            <div className={`circle ${activeStep === step ? "active" : ""}`}>
              {step}
            </div>
            <span className={`step-label ${activeStep === step ? "active-label" : ""}`}>
              {{
                1: "معلومات الطلب",
                2: "معلومات مزود الخدمة",
                3: "تفاصيل الدفع",
                4: "التواصل",
                5: "الملفات المرفقة",
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

      {activeStep === 3 && paymentInfo && (
        <div className="step-content">
          <h3 className="section-title">تفاصيل الدفع</h3>
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
        </div>
      )}

      {activeStep === 4 && (
        <div className="step-content chat-step">
          <h3 className="section-title">التواصل</h3>
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
            <div className="chat-middle-space"></div>
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
    </div>
  );
};

export default OnProgressOrdersDetails;
