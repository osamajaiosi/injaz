import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Rating from '@mui/material/Rating';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import HistoryIcon from '@mui/icons-material/History';
import { useAuth } from "../Contexts/AuthContext";
import "./Providerstudnts.css";
import { FormControl, Select, MenuItem, ToggleButton, ToggleButtonGroup } from '@mui/material';

const Providerstudents = () => {
  const { subServiceId } = useParams();
  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userType } = useAuth();
  const [universities, setUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [activeFilter, setActiveFilter] = useState('all');
  const [noResults, setNoResults] = useState(false);

  useEffect(() => {
    const fetchUniversities = async () => {
      try {
        const res = await axios.get(
          "http://eallaenjazapi.runasp.net/api/Unvirsty/GET_ALL_UNVIRSTY"
        );
        setUniversities(res.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
      }
    };
    fetchUniversities();
  }, []);

  const fetchProviders = async (filterType = 'all', uniId = selectedUniversity) => {
    setNoResults(false);
    console.log('subServiceId:', subServiceId, 'uniId:', uniId);
    setLoading(true);
    setActiveFilter(filterType);
    let url = '';
    switch (filterType) {
      case 'all':
        url = uniId
          ? `http://eallaenjazapi.runasp.net/api/Serves_Student/Get_ALL_INFO_SAMPLE_STUDENT_PROVEDER_BRANCH_SERVER?id_branch_serves=${subServiceId}&id_unvirsty=${uniId}`
          : `http://eallaenjazapi.runasp.net/api/Serves_Student/Get_ALL_INFO_SAMPLE_STUDENT_PROVEDER_BRANCH_SERVER?id_branch_serves=${subServiceId}`;
        break;
      case 'latest':
        url = `http://eallaenjazapi.runasp.net/api/Serves_Student/GET_SAMPLE_INFO_FROM_SERVER_STUDENT_BY_ID_Branch_serves_and_ID_Unvirsty_For_modern_services?id_branch_serves=${subServiceId}&id_unvirsty=${uniId}`;
        break;
      case 'oldest':
        url = `http://eallaenjazapi.runasp.net/api/Serves_Student/GET_SAMPLE_INFO_FROM_SERVER_STUDENT_BY_ID_Branch_serves_and_ID_Unvirsty_For_Older_services?id_branch_serves=${subServiceId}&id_unvirsty=${uniId}`;
        break;
      case 'topRated':
        url = `http://eallaenjazapi.runasp.net/api/Serves_Student/GET_SAMPLE_INFO_FROM_SERVER_STUDENT_BY_ID_Branch_serves_and_ID_Unvirsty_For_The_most_distinguished?id_branch_serves=${subServiceId}&id_unvirsty=${uniId}`;
        break;
      default:
        url = `http://eallaenjazapi.runasp.net/api/Serves_Student/Get_ALL_INFO_SAMPLE_STUDENT_PROVEDER_BRANCH_SERVER?id_branch_serves=${subServiceId}&id_unvirsty=${uniId}`;
    }
    try {
      const response = await axios.get(url);
      setProviders(response.data);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        setNoResults(true);
        setProviders([]);
        setLoading(false);
        return;
      }
      console.error("Error fetching providers:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedUniversity) {
      fetchProviders('latest', selectedUniversity);
    } else {
      fetchProviders('all', selectedUniversity);
    }
  }, [subServiceId, selectedUniversity]);

  return (
    <section className="providers-section">
      <div className="providers-container">
        <div className="section-header">
          <h2>مزودي الخدمة</h2>
          <p>اختر من بين مزودي الخدمة المتاحين.</p>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0', flexWrap: 'wrap', gap: '1rem' }}>
          <FormControl
            fullWidth
            variant="outlined"
            size="small"
            sx={{
              minWidth: 200,
              transition: 'transform 0.2s ease-in-out',
              '&:hover': { transform: 'scale(1.01)' },
              '&:focus-within': {
                boxShadow: '0 0 0 2px var(--primary-color)30',
                transform: 'scale(1.01)',
              },
              '& .MuiOutlinedInput-root': {
                backgroundColor: 'white',
                borderRadius: 1,
                '& fieldset': { borderColor: 'var(--primary-color)' },
                '&:hover fieldset': { borderColor: 'var(--primary-color)' },
                '&.Mui-focused fieldset': { borderColor: 'var(--primary-color)' },
              },
              '& .MuiSelect-icon': { color: 'var(--primary-color)' },
            }}
          >
            <Select
              fullWidth
              displayEmpty
              value={selectedUniversity}
              onChange={(e) => setSelectedUniversity(e.target.value)}
              renderValue={(val) => {
                if (!val) return 'كل الجامعات';
                const uni = universities.find((u) => u.id === val);
                return uni ? uni.name : val;
              }}
              sx={{
                /* inherit FormControl colors */
              }}
            >
              <MenuItem value="">
                <em>كل الجامعات</em>
              </MenuItem>
              {universities.map((uni) => (
                <MenuItem key={uni.id} value={uni.id}>{uni.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          {selectedUniversity && (
            <ToggleButtonGroup
              value={activeFilter}
              exclusive
              onChange={(e, value) => value && fetchProviders(value, selectedUniversity)}
              size="medium"
              sx={{
                alignSelf: 'center',
                bgcolor: '#f5f5f5',
                borderRadius: '999px',
                p: '4px',
                boxShadow: 1,
                '& .MuiToggleButton-root': {
                  border: 'none',
                  borderRadius: '999px',
                  textTransform: 'none',
                  color: 'var(--primary-color)',
                  px: 2,
                  py: 1,
                  minWidth: '100px',
                  bgcolor: 'transparent',
                  transition: 'background 0.3s ease',
                },
                '& .MuiToggleButton-root:not(.Mui-selected):hover': {
                  bgcolor: '#cdcd04',
                },
                '& .MuiToggleButton-root.Mui-selected': {
                  bgcolor: 'var(--primary-color)',
                  color: '#fff',
                  boxShadow: 'inset 0 0 0 1px var(--primary-color)',
                },
                '& .MuiToggleButton-root.Mui-selected:hover': {
                  bgcolor: 'var(--primary-color)',
                },
              }}
            >
              <ToggleButton value="latest">
                <AccessTimeIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                الأحدث
              </ToggleButton>
              <ToggleButton value="oldest">
                <HistoryIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                الأقدم
              </ToggleButton>
              <ToggleButton value="topRated">
                <StarIcon fontSize="inherit" sx={{ mr: 0.5 }} />
                الأعلى تقييمًا
              </ToggleButton>
            </ToggleButtonGroup>
          )}
        </div>
        <div className="providers-grid">
          {loading ? (
            <p>جاري تحميل البيانات...</p>
          ) : (
            !noResults && providers.length > 0 && (
              providers.map((provider) => {
                console.log('provider obj:', provider);
                return (
                  <div key={provider.id || provider.iD_Serves} className="provider-card">
                    <div className="provider-image">
                      <img
                        src={
                          provider.imege_url &&
                          provider.imege_url.startsWith("http")
                            ? provider.imege_url
                            : "/for-test-provider/software-developer-6521720-scaled.webp"
                        }
                        alt={provider.service_Address}
                      />
                    </div>
                    <div className="provider-info">
                      <h3>{provider.service_Address}</h3>
                      <p className="price">ابتداءً من {provider.price} دينار</p>
                      <div className="rating-box" dir="ltr">
                        <Rating
                          name="read-only"
                          value={parseFloat(provider.avg_rating)}
                          precision={0.5}
                          readOnly
                          sx={{ direction: 'ltr' }}
                          icon={<StarIcon style={{ color: "#fbc02d" }} fontSize="inherit" />}
                          emptyIcon={<StarBorderIcon style={{ color: "#ccc" }} fontSize="inherit" />}  
                        />
                      </div>
                      <div className="card-actions">
                        <Link
                          to={`/show-info/${provider.id||provider.iD_Serves}`}
                          className="provider-link"
                        >
                          المزيد
                        </Link>
                        {userType === "guest" && (
                          <Link
                            to="/register"
                            className="provider-link request-button"
                          >
                            اطلب الخدمة
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>
      </div>
    </section>
  );
};

export default Providerstudents;
