import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import "./OrdersInbox.css";
import { ChevronLeft, BookOpen, PenTool, Code, Calendar, Heart, Stethoscope, Home, ShoppingCart, Globe, Truck, Users } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UnapprovedOrderDetails = () => {
  const { id } = useParams();
  const [activeStep, setActiveStep] = useState(1);
  const [orderDetails, setOrderDetails] = useState(null);
  const [requesterInfo, setRequesterInfo] = useState(null);
  const [file, setFile] = useState(null);
  // track existing file ID from order details
  const [existingFileId, setExistingFileId] = useState(null);
  const [nameServices, setNameServices] = useState([]);
  const [branchServices, setBranchServices] = useState([]);
  const [locations, setLocations] = useState([]);
  const [providers, setProviders] = useState([]);
  const [provLoading, setProvLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleting, setDeleting] = useState(false);

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

  useEffect(() => {
    axios.get(`http://eallaenjazapi.runasp.net/api/Request_Order/GET_INFO_REQUEST_ORDER_BY_ID_REQUEST_ORDER${id}`)
      .then(res => {
        setOrderDetails(res.data);
        // set existing file ID if present
        setExistingFileId(res.data.iD_Files ?? res.data.iD_File ?? null);
        const pid = res.data.iD_pesron_Presenter_Order;
        if (pid) {
          axios.get(`http://eallaenjazapi.runasp.net/api/Person/GET_PERSON_PY_ID${pid}`)
            .then(r => setRequesterInfo(r.data))
            .catch(e => console.error('Error fetching requester:', e));
        }
      })
      .catch(err => console.error('Error fetching order details:', err));
  }, [id]);

  useEffect(() => {
    axios.get('http://eallaenjazapi.runasp.net/api/ Name_Serves/GET_ALL_NAME_SERVES')
      .then(res => setNameServices(res.data))
      .catch(e => console.error('Error fetching name services:', e));
  }, []);

  useEffect(() => {
    axios.get('http://eallaenjazapi.runasp.net/api/Branch_Serves/GET_ALL_BRANCH_SERVES')
      .then(res => setBranchServices(res.data))
      .catch(e => console.error('Error fetching branch services:', e));
  }, []);

  useEffect(() => {
    axios.get('http://eallaenjazapi.runasp.net/api/Location/GET_ALL_LOCATION')
      .then(res => setLocations(res.data))
      .catch(e => console.error('Error fetching locations:', e));
  }, []);

  useEffect(() => {
    if (orderDetails?.iD_Student_Service_provider) {
      setProvLoading(true);
      const ids = orderDetails.iD_Student_Service_provider
        .split(',')
        .map(id => id.replace(/\D/g, '').trim())
        .filter(id => id);
      Promise.all(
        ids.map(id =>
          axios.get(
            `http://eallaenjazapi.runasp.net/api/Student_/GET_INFO_FROM_STUDENT_UNVIRSTY_PERSON_USED_SHOW_SERVES_BY_ID_STUDENT${id}`
          ).then(res => ({ ...res.data, studentServiceProviderId: id }))
        )
      )
        .then(dataArr => setProviders(dataArr))
        .catch(e => console.error('Error fetching providers:', e))
        .finally(() => setProvLoading(false));
    }
  }, [orderDetails]);

  const handleFileChange = e => setFile(e.target.files[0]);

  const handleSave = () => {
    const uploadFile = () => {
      if (!file) return Promise.resolve(null);
      const form = new FormData();
      form.append('file', file);
      return axios.post('http://eallaenjazapi.runasp.net/api/Files/UploadFile', form)
        .then(response => response.data.id)
        .catch(e => {
          console.error('File upload error:', e);
          return null;
        });
    };

    const saveOrder = (fileId) => {
      // find service ID by name
      const serviceObj = nameServices.find(ns => ns.name_Serves === orderDetails.name_Serves);
      const id_Name_Serves = serviceObj ? serviceObj.id : orderDetails.iD_Name_Serves;
      // find branch ID by name
      const branchObj = branchServices.find(bs => bs.name === orderDetails.branch_Serves);
      const id_Branch_Serves = branchObj ? branchObj.id : orderDetails.iD_branch_Serves;
      // find location ID by name
      const locationObj = locations.find(loc => loc.name === orderDetails.location);
      const id_Location = locationObj ? locationObj.id : orderDetails.iD_Location;
      // map delivery type to numeric value
      const typeServesValue = orderDetails.type_serves === 'Onsite' ? 2 : 1;
      const requestBody = {
        id: orderDetails.id,
        titel_serves: orderDetails.titel_serves,
        id_Name_Serves,
        id_Branch_Serves,
        id_Location,
        describtion_Serves: orderDetails.describtion_Serves,
        price: orderDetails.price,
        delivery_time: orderDetails.delivery_time,
        iD_pesron_Presenter_Order: orderDetails.iD_pesron_Presenter_Order,
        type_serves: typeServesValue,
        iD_state_Order:3,
        dtae_Order: orderDetails.dtae_Order,
        iD_Student_Service_provider: orderDetails.iD_Student_Service_provider,
        iD_Files: fileId || existingFileId
      };
      console.log('RequestBody to API:', requestBody);

      axios.put(
        `http://eallaenjazapi.runasp.net/api/Request_Order/Update_Request_Order ${id}`,
        requestBody,
        { headers: { accept: 'text/plain' } }
      )
        .then(() => {
          toast.success("✅ تم تعديل الطلب بنجاح", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeButton: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            style: {
              fontFamily: "Cairo, sans-serif",
              fontSize: "1rem",
              direction: "rtl",
            },
          });
          console.log('Order updated successfully');
        })
        .catch(e => console.error('Save error:', e));
    };

    if (file) {
      uploadFile().then(fid => {
        // update existingFileId with new uploaded file ID
        setExistingFileId(fid);
        saveOrder(fid);
      });
    } else {
      // no new file: pass existing file ID to saveOrder
      saveOrder(existingFileId);
    }
  };

  const handleDelete = () => setShowDeleteModal(true);

  const handleDeleteConfirmed = async () => {
    setDeleting(true);
    try {
      await axios.delete(`http://eallaenjazapi.runasp.net/api/Request_Order/Delete_Request_Order ${id}`);
      toast.success("✅ تم حذف الخدمة", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeButton: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        style: {
          fontFamily: "Cairo, sans-serif",
          fontSize: "1rem",
          direction: "rtl",
        },
      });
      setShowDeleteModal(false);
    } catch (e) {
      console.error('Delete error:', e);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="add-service-container">
      <ToastContainer />
      <h2 className="section-title-main">تفاصيل الطلب غير الموافق عليه</h2>
      <div className="steps-navigation labeled">
        {[1,2,3,4].map(num => (
          <div key={num} className="step-item" onClick={() => {
            if (num === 1) {
              window.location.reload();
            } else {
              setActiveStep(num);
            }
          }}>
            <div className={`circle ${activeStep===num?'active':''}`}>{num}</div>
            <span className="step-label">
              {num===1&&'معلومات الطلب'}{num===2&&'معلومات مزودي الخدمة'}{num===3&&'تعديل الطلب'}{num===4&&'حذف الطلب'}
            </span>
          </div>
        ))}
      </div>

      {activeStep===1 && orderDetails && (
        <div className="step-content">
         
          <h3 className="section-title">معلومات الطلب</h3> <div className="service-title-center with-icon">
            {(() => {
              const Icon = iconMap[orderDetails.name_Serves?.trim()] || ChevronLeft;
              return (
                <>
                  <Icon size={24} color="#00a300" />
                  <span>{orderDetails.titel_serves}</span>
                </>
              );
            })()}
          </div>
          <div className="details-grid">

            <div className="detail-item">
              <span className="detail-label"><i className="fas fa-layer-group icon"></i>الخدمة الرئيسية:</span>
              <span className="detail-value">{orderDetails.name_Serves}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label"><i className="fas fa-sitemap icon"></i>الخدمة الفرعية:</span>
              <span className="detail-value">{orderDetails.branch_Serves}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label"><i className="fas fa-coins icon"></i>السعر:</span>
              <span className="detail-value">{orderDetails.price} دينار</span>
            </div>
            <div className="detail-item">
              <span className="detail-label"><i className="fas fa-clock icon"></i>  الوقت المطلوب لانجاز الخدمة:</span>
              <span className="detail-value">{orderDetails.delivery_time}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label"><i className="fas fa-globe icon"></i>طريقة التقديم:</span>
              <span className="detail-value">{orderDetails.type_serves ==="Online" ? 'اونلاين' : 'وجاهي'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label"><i className="fas fa-calendar-alt icon"></i>تاريخ الطلب:</span>
              <span className="detail-value">{new Date(orderDetails.dtae_Order).toLocaleDateString('ar-EG')}</span>
            </div>           
             {orderDetails.files && (
              <div className="detail-item">      <span className="detail-label">
              <i className="fas fa-paperclip icon"></i> الملف المرفق:
            </span>
                <a
                  className="file-download-link"
                  href={orderDetails.files}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fas fa-paperclip icon"></i> تحميل الملف
                </a>
              </div>
            )}
            {orderDetails.describtion_Serves && (
              <div className="detail-item full">
                <span className="detail-label"><i className="fas fa-info-circle icon"></i>تفاصيل إضافية:</span>
                <span className="detail-value">{orderDetails.describtion_Serves}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {activeStep===2 && (
        <>
       
        <div className="step-content">
          <h3 className="section-title">مزودي الخدمة</h3>
          {provLoading ? (
            <p>جاري تحميل البيانات...</p>
          ) : providers.length > 0 ? (
            <div className="providers-grid">
              {providers.map((provider, idx) => (
                <div key={`${provider.studentServiceProviderId}-${idx}`} className="provider-card">
                  <div className="provider-image">
                    <img
                      src={provider.mainImageUrl}
                      
                    />
                  </div>
                  <div className="provider-info">
                    <h3>{provider.fullName}</h3>
                    <Link to={`/show-info/${provider.studentServiceProviderId}`} className="provider-link">
                      عرض
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="no-services">لا توجد بيانات لمزودي الخدمة.</p>
          )}
        </div>
        </>
      )}

      {activeStep===3 && orderDetails && (
        <div className="step-content">
          <h3 className="section-title">تعديل الطلب</h3>
          <div className="title-edit">
            <span className="detail-label"><i className="fas fa-tag icon"></i> عنوان الخدمة:</span>
            <input
              type="text"
              value={orderDetails.titel_serves}
              placeholder="عنوان الخدمة"
              onChange={e => setOrderDetails({ ...orderDetails, titel_serves: e.target.value })}
            />
          </div>
          <div className="details-grid">
            {[
              { label: 'الخدمة الرئيسية', value: orderDetails.name_Serves, type: 'text', readOnly: true, icon: 'fas fa-th-large' },
              { label: 'الخدمة الفرعية', value: orderDetails.branch_Serves, type: 'text', readOnly: true, icon: 'fas fa-th-list' },
              { label: 'السعر', key: 'price', type: 'number', icon: 'fas fa-coins' },
              { label: 'الوقت المطلوب', key: 'delivery_time', type: 'text', icon: 'fas fa-clock' },
              { label: 'طريقة التقديم', key: 'type_serves', type: 'select', options: [ {value:'Online', label:'عن بعد'}, {value:'Onsite', label:'وجاهي'} ], icon: 'fas fa-globe' },
              { label: 'تفاصيل إضافية', key: 'describtion_Serves', type: 'textarea', icon: 'fas fa-info-circle' },
              { label: 'إضافة ملف', key: 'file', type: 'file', icon: 'fas fa-paperclip' },
            ].map((field, idx) => (
              <div className={`detail-item ${field.type==='textarea'?'full':''}`} key={idx}>
                <span className="detail-label"><i className={`${field.icon} icon`}></i> {field.label}:</span>
                {field.type === 'select' ? (
                  <select
                    value={orderDetails[field.key]}
                    onChange={e => setOrderDetails({ ...orderDetails, [field.key]: e.target.value })}
                  >
                    {field.options.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    value={orderDetails[field.key]}
                    onChange={e => setOrderDetails({ ...orderDetails, [field.key]: e.target.value })}
                  />
                ) : field.type === 'file' ? (
                  <>
                    <input type="file" onChange={handleFileChange} />
                    {!file && existingFileId && (
                      <div className="existing-file-info">
                        <a
                          className="file-download-link"
                          href={orderDetails.files}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <i className="fas fa-paperclip icon"></i> الملف الحالي
                        </a>
                        <div className="existing-file-id">ID الملف: {existingFileId}</div>
                      </div>
                    )}
                  </>
                ) : (
                  <input
                    type={field.type}
                    value={field.readOnly ? field.value : orderDetails[field.key]}
                    readOnly={field.readOnly}
                    onChange={e => setOrderDetails({ ...orderDetails, [field.key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <button className="save-button" onClick={handleSave}>حفظ</button>
        </div>
      )}

      {activeStep===4 && (
        <div className="step-content">
          <h3 className="section-title">حذف الطلب</h3>
          <button className="reject-button" onClick={handleDelete}>حذف</button>
        </div>
      )}
      {showDeleteModal && (
        <div className="confirm-modal">
          <div className="modal-content">
            <p>هل أنت متأكد من حذف طلبك؟ لا يمكنك التراجع بعد ذلك.</p>
            <div className="modal-buttons">
              <button
                className="agree-button"
                onClick={handleDeleteConfirmed}
                disabled={deleting}
              >
                {deleting ? 'جارٍ الحذف...' : 'موافق'}
              </button>
              <button onClick={() => setShowDeleteModal(false)}>إلغاء</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnapprovedOrderDetails;
