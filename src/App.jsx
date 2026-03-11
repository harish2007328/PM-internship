import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  X, 
  Plus, 
  Edit2, 
  Trash2, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Briefcase,
  GraduationCap,
  Award,
  Globe,
  Loader2
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { insforge } from './lib/insforge';

// Helper for tailwind classes
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// --- CONSTANTS ---

const INDIAN_STATE_DISTRICTS = {
  "Andhra Pradesh": ["Anantapur", "Chittoor", "East Godavari", "Guntur", "Krishna", "Kurnool", "Prakasam", "Srikakulam", "Visakhapatnam", "Vizianagaram", "West Godavari", "Kadapa", "Nellore"],
  "Arunachal Pradesh": ["Tawang", "West Kameng", "East Kameng", "Papum Pare", "Kurung Kumey", "Kra Daadi", "Lower Subansiri", "Upper Subansiri", "West Siang", "East Siang", "Siang", "Upper Siang", "Lower Siang", "Lower Dibang Valley", "Dibang Valley", "Anjaw", "Lohit", "Namsai", "Changlang", "Tirap", "Longding"],
  "Assam": ["Baksa", "Barpeta", "Biswanath", "Bongaigaon", "Cachar", "Charaideo", "Chirang", "Darrang", "Dhemaji", "Dhubri", "Dibrugarh", "Goalpara", "Golaghat", "Hailakandi", "Hojai", "Jorhat", "Kamrup Metropolitan", "Kamrup", "Karbi Anglong", "Karimganj", "Kokrajhar", "Lakhimpur", "Majuli", "Morigaon", "Nagaon", "Nalbari", "Dima Hasao", "Sivasagar", "Sonitpur", "South Salmara-Mankachar", "Tinsukia", "Udalguri", "West Karbi Anglong"],
  "Bihar": ["Araria", "Arwal", "Aurangabad", "Banka", "Begusarai", "Bhagalpur", "Bhojpur", "Buxar", "Darbhanga", "East Champaran", "Gaya", "Gopalganj", "Jamui", "Jehanabad", "Kaimur", "Katihar", "Khagaria", "Kishanganj", "Lakhisarai", "Madhepura", "Madhubani", "Munger", "Muzaffarpur", "Nalanda", "Nawada", "Patna", "Purnia", "Rohtas", "Saharsa", "Samastipur", "Saran", "Sheikhpura", "Sheohar", "Sitamarhi", "Siwan", "Supaul", "Vaishali", "West Champaran"],
  "Chhattisgarh": ["Balod", "Baloda Bazar", "Balrampur", "Bastar", "Bemetara", "Bijapur", "Bilaspur", "Dantewada", "Dhamtari", "Durg", "Gariaband", "Janjgir-Champa", "Jashpur", "Kabirdham", "Kanker", "Kondagaon", "Korba", "Koriya", "Mahasamund", "Mungeli", "Narayanpur", "Raigarh", "Raipur", "Rajnandgaon", "Sukma", "Surajpur", "Surguja"],
  "Goa": ["North Goa", "South Goa"],
  "Gujarat": ["Ahmedabad", "Amreli", "Anand", "Aravalli", "Banaskantha", "Bharuch", "Bhavnagar", "Botad", "Chhota Udepur", "Dahod", "Dang", "Devbhoomi Dwarka", "Gandhinagar", "Gir Somnath", "Jamnagar", "Junagadh", "Kheda", "Kutch", "Mahisagar", "Mehsana", "Morbi", "Narmada", "Navsari", "Panchmahal", "Patan", "Porbandar", "Rajkot", "Sabarkantha", "Surat", "Surendranagar", "Tapi", "Vadodara", "Valsad"],
  "Haryana": ["Ambala", "Bhiwani", "Charkhi Dadri", "Faridabad", "Fatehabad", "Gurugram", "Hisar", "Jhajjar", "Jind", "Kaithal", "Karnal", "Kurukshetra", "Mahendragarh", "Nuh", "Palwal", "Panchkula", "Panipat", "Rewari", "Rohtak", "Sirsa", "Sonipat", "Yamunanagar"],
  "Himachal Pradesh": ["Bilaspur", "Chamba", "Hamirpur", "Kangra", "Kinnaur", "Kullu", "Lahaul and Spiti", "Mandi", "Shimla", "Sirmaur", "Solan", "Una"],
  "Jharkhand": ["Bokaro", "Chatra", "Deoghar", "Dhanbad", "Dumka", "East Singhbhum", "Garhwa", "Giridih", "Godda", "Gumla", "Hazaribagh", "Jamtara", "Khunti", "Koderma", "Latehar", "Lohardaga", "Pakur", "Palamu", "Ramgarh", "Ranchi", "Sahibganj", "Seraikela Kharsawan", "Simdega", "West Singhbhum"],
  "Karnataka": ["Bagalkot", "Ballari", "Belagavi", "Bengaluru Rural", "Bengaluru Urban", "Bidar", "Chamarajanagar", "Chikkaballapur", "Chikkamagaluru", "Chitradurga", "Dakshina Kannada", "Davanagere", "Dharwad", "Gadag", "Hassan", "Haveri", "Kalaburagi", "Kodagu", "Kolar", "Koppal", "Mandya", "Mysuru", "Raichur", "Ramanagara", "Shivamogga", "Tumakuru", "Udupi", "Uttara Kannada", "Vijayapura", "Yadgir"],
  "Kerala": ["Alappuzha", "Ernakulam", "Idukki", "Kannur", "Kasaragod", "Kollam", "Kottayam", "Kozhikode", "Malappuram", "Palakkad", "Pathanamthitta", "Thiruvananthapuram", "Thrissur", "Wayanad"],
  "Madhya Pradesh": ["Agar Malwa", "Alirajpur", "Anuppur", "Ashoknagar", "Balaghat", "Barwani", "Betul", "Bhind", "Bhopal", "Burhanpur", "Chhatarpur", "Chhindwara", "Damoh", "Datia", "Dewas", "Dhar", "Dindori", "Guna", "Gwalior", "Harda", "Hoshangabad", "Indore", "Jabalpur", "Jhabua", "Katni", "Khandwa", "Khargone", "Mandla", "Mandsaur", "Morena", "Narsinghpur", "Neemuch", "Panna", "Raisen", "Rajgarh", "Ratlam", "Rewa", "Sagar", "Satna", "Sehore", "Seoni", "Shahdol", "Shajapur", "Sheopur", "Shivpuri", "Sidhi", "Singrauli", "Tikamgarh", "Ujjain", "Umaria", "Vidisha"],
  "Maharashtra": ["Ahmednagar", "Akola", "Amravati", "Aurangabad", "Beed", "Bhandara", "Buldhana", "Chandrapur", "Dhule", "Gadchiroli", "Gondia", "Hingoli", "Jalgaon", "Jalna", "Kolhapur", "Latur", "Mumbai City", "Mumbai Suburban", "Nagpur", "Nanded", "Nandurbar", "Nashik", "Osmanabad", "Palghar", "Parbhani", "Pune", "Raigad", "Ratnagiri", "Sangli", "Satara", "Sindhudurg", "Solapur", "Thane", "Wardha", "Washim", "Yavatmal"],
  "Manipur": ["Bishnupur", "Chandel", "Churachandpur", "Imphal East", "Imphal West", "Jiribam", "Kakching", "Kamjong", "Kangpokpi", "Noney", "Pherzawl", "Senapati", "Tamenglong", "Tengnoupal", "Thoubal", "Ukhrul"],
  "Meghalaya": ["East Garo Hills", "East Jaintia Hills", "East Khasi Hills", "North Garo Hills", "Ri Bhoi", "South Garo Hills", "South West Garo Hills", "South West Khasi Hills", "West Garo Hills", "West Jaintia Hills", "West Khasi Hills"],
  "Mizoram": ["Aizawl", "Champhai", "Kolasib", "Lawngtlai", "Lunglei", "Mamit", "Saiha", "Serchhip"],
  "Nagaland": ["Dimapur", "Kiphire", "Kohima", "Longleng", "Mokokchung", "Mon", "Peren", "Phek", "Tuensang", "Wokha", "Zunheboto"],
  "Odisha": ["Angul", "Balangir", "Balasore", "Bargarh", "Bhadrak", "Boudh", "Cuttack", "Deogarh", "Dhenkanal", "Gajapati", "Ganjam", "Jagatsinghpur", "Jajpur", "Jharsuguda", "Kalahandi", "Kandhamal", "Kendrapara", "Kendujhar", "Khorda", "Koraput", "Malkangiri", "Mayurbhanj", "Nabarangpur", "Nayagarh", "Nuapada", "Puri", "Rayagada", "Sambalpur", "Subarnapur", "Sundargarh"],
  "Punjab": ["Amritsar", "Barnala", "Bathinda", "Faridkot", "Fatehgarh Sahib", "Fazilka", "Ferozepur", "Gurdaspur", "Hoshiarpur", "Jalandur", "Kapurthala", "Ludhiana", "Mansa", "Moga", "Muktsar", "Pathankot", "Patiala", "Rupnagar", "Sahibzada Ajit Singh Nagar", "Sangrur", "Shahid Bhagat Singh Nagar", "Sri Muktsar Sahib", "Tarn Taran"],
  "Rajasthan": ["Ajmer", "Alwar", "Banswara", "Baran", "Barmer", "Bharatpur", "Bhilwara", "Bikaner", "Bundi", "Chittorgarh", "Churu", "Dausa", "Dholpur", "Dungarpur", "Hanumangarh", "Jaipur", "Jaisalmer", "Jalore", "Jhalawar", "Jhunjhunu", "Jodhpur", "Karauli", "Kota", "Nagaur", "Pali", "Pratapgarh", "Rajsamand", "Sawai Madhopur", "Sikar", "Sirohi", "Sri Ganganagar", "Tonk", "Udaipur"],
  "Sikkim": ["East Sikkim", "North Sikkim", "South Sikkim", "West Sikkim"],
  "Tamil Nadu": ["Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore", "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram", "Kanyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai", "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai", "Ramanathapuram", "Ranipet", "Salem", "Sivagangai", "Tenkasi", "Thanjavur", "Theni", "Thoothukudi (Tuticorin)", "Tiruchirappalli", "Tirunelveli", "Tirupathur", "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore", "Viluppuram", "Virudhunagar"],
  "Telangana": ["Adilabad", "Bhadradri Kothagudem", "Hyderabad", "Jagtial", "Jangaon", "Jayashankar Bhupalpally", "Jogulamba Gadwal", "Kamareddy", "Karimnagar", "Khammam", "Kumuram Bheem", "Mahabubabad", "Mahabubnagar", "Mancherial", "Medak", "Medchal", "Nagarkurnool", "Nalgonda", "Nirmal", "Nizamabad", "Peddapalli", "Rajanna Sircilla", "Rangareddy", "Sangareddy", "Siddipet", "Suryapet", "Vikarabad", "Wanaparthy", "Warangal Rural", "Warangal Urban", "Yadadri Bhuvanagiri"],
  "Tripura": ["Dhalai", "Gomati", "Khowai", "North Tripura", "Sepahijala", "South Tripura", "Unakoti", "West Tripura"],
  "Uttar Pradesh": ["Agra", "Aligarh", "Allahabad", "Ambedkar Nagar", "Amethi", "Amroha", "Auraiya", "Azamgarh", "Baghpat", "Bahraich", "Ballia", "Balrampur", "Banda", "Barabanki", "Bareilly", "Basti", "Bhadohi", "Bijnor", "Budaun", "Bulandshahr", "Chandauli", "Chitrakoot", "Deoria", "Etah", "Etawah", "Faizabad", "Farrukhabad", "Fatehpur", "Firozabad", "Gautam Buddha Nagar", "Ghaziabad", "Ghazipur", "Gonda", "Gorakhpur", "Hamirpur", "Hapur", "Hardoi", "Hathras", "Jalaun", "Jaunpur", "Jhansi", "Kannauj", "Kanpur Dehat", "Kanpur Nagar", "Kasganj", "Kaushambi", "Kheri", "Kushinagar", "Lalitpur", "Lucknow", "Maharajganj", "Mahoba", "Mainpuri", "Mathura", "Mau", "Meerut", "Mirzapur", "Moradabad", "Muzaffarnagar", "Pilibhit", "Pratapgarh", "Raebareli", "Rampur", "Saharanpur", "Sambhal", "Sant Kabir Nagar", "Shahjahanpur", "Shamli", "Shravasti", "Siddharthnagar", "Sitapur", "Sonbhadra", "Sultanpur", "Unnao", "Varanasi"],
  "Uttarakhand": ["Almora", "Bageshwar", "Chamoli", "Champawat", "Dehradun", "Haridwar", "Nainital", "Pauri Garhwal", "Pithoragarh", "Rudraprayag", "Tehri Garhwal", "Udham Singh Nagar", "Uttarkashi"],
  "West Bengal": ["Alipurduar", "Bankura", "Birbhum", "Cooch Behar", "Dakshin Dinajpur", "Darjeeling", "Hooghly", "Howrah", "Jalpaiguri", "Jhargram", "Kalimpong", "Kolkata", "Malda", "Murshidabad", "Nadia", "North 24 Parganas", "Paschim Medinipur", "Paschim Bardhaman", "Purba Bardhaman", "Purba Medinipur", "Purulia", "South 24 Parganas", "Uttar Dinajpur"],
  "Andaman and Nicobar Islands": ["Nicobar", "North and Middle Andaman", "South Andaman"],
  "Chandigarh": ["Chandigarh"],
  "Dadra and Nagar Haveli and Daman and Diu": ["Dadra and Nagar Haveli", "Daman", "Diu"],
  "Delhi": ["Central Delhi", "East Delhi", "New Delhi", "North Delhi", "North East Delhi", "North West Delhi", "Shahdara", "South Delhi", "South East Delhi", "South West Delhi", "West Delhi"],
  "Jammu and Kashmir": ["Anantnag", "Bandipora", "Baramulla", "Budgam", "Doda", "Ganderbal", "Jammu", "Kathua", "Kishtwar", "Kulgam", "Kupwara", "Poonch", "Pulwama", "Rajouri", "Ramban", "Reasi", "Samba", "Shopian", "Srinagar", "Udhampur"],
  "Ladakh": ["Kargil", "Leh"],
  "Lakshadweep": ["Lakshadweep"],
  "Puducherry": ["Karaikal", "Mahe", "Puducherry", "Yanam"]
};

const PREDEFINED_SKILLS = [
  "Accounting", "Adobe XD", "AWS", "AutoCAD", "Azure", "Billing", "Biochemistry", "Bio-Ethics", 
  "CI/CD", "Catia", "Chemical Engineering", "Cold Chain Management", "Communication", 
  "Compliance", "Consumer Behavior", "Crop Management", "Customer Service", "Data Analysis", 
  "Data Interpretation", "Data Management", "Digital Marketing", "Documentation", "Docker", 
  "Electrical Systems", "Environmental Science", "ERP Systems", "Ethical Hacking", "Excel", 
  "Figma", "Financial Modeling", "Firewalls", "First Aid", "FMCG", "Geology", "Git", 
  "Hospital Management", "Internal Audit", "Inventory Management", "IoT in Agri", "ISO Standards", 
  "Java", "Jenkins", "Jira", "Kubernetes", "Lab Safety", "Lean Manufacturing", "Linux", 
  "Logistics", "Manual Testing", "Market Research", "MATLAB", "MS Office", "Networking", 
  "Organic Farming", "OSHA", "Pathology", "Patient Care", "Pest Control", "Petroleum Engineering", 
  "PLC", "Plant Science", "Precision Tools", "Problem Solving", "Process Control", "Procurement", 
  "Product Knowledge", "Python", "Risk Assessment", "Risk Mitigation", "Safety Protocols", 
  "Sales", "Selenium", "SEO", "Shell Scripting", "Six Sigma", "Soil Analysis", "Solar Design", 
  "SolidWorks", "Statistics", "Sustainability", "Tally", "Taxation", "Thermodynamics", 
  "Troubleshooting", "User Research", "Valuation", "Vehicle Dynamics", "Visual Merchandising", "Wireframing"
].sort();

const PREDEFINED_LANGUAGES = [
  "Hindi", "English", "Tamil", "Telugu", "Kannada", "Malayalam", "Bengali", "Marathi", "Gujarati", 
  "Punjabi", "Urdu", "Odia", "Assamese", "Sanskrit", "French", "German", "Spanish", "Japanese", 
  "Chinese", "Arabic"
].sort();

const QUALIFICATIONS = ["10th", "12th", "Diploma", "UG", "PG", "PhD", "Other"];
const COURSES = {
  "UG": ["B.Tech", "B.Sc", "B.Com", "BA", "BCA", "BBA", "Other"],
  "PG": ["M.Tech", "M.Sc", "M.Com", "MA", "MCA", "MBA", "Other"],
  "10th": ["High School"],
  "12th": ["Intermediate / Senior Secondary"],
  "Diploma": ["Polytechnic", "Vocational Diploma"],
  "PhD": ["Doctorate"],
  "Other": ["Other"]
};

// --- COMPONENTS ---

const Label = ({ children, required, className }) => (
  <label className={cn("label-text", className)}>
    {children} {required && <span className="text-accent">*</span>}
  </label>
);

const Input = ({ ...props }) => (
  <input {...props} className={cn("input-field", props.className)} />
);

const Select = ({ children, ...props }) => (
  <select {...props} className={cn("input-field appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2024%2024%20stroke%3D%22currentColor%22%3E%3Cpath%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%222%22%20d%3D%22M19%209l-7%207-7-7%22%20%2F%3E%3C%2Fsvg%3E')] bg-[length:1.25em_1.25em] bg-[right_0.75rem_center] bg-no-repeat pr-10", props.className)}>
    {children}
  </select>
);

// --- MAIN APP ---

export default function App() {
  const [step, setStep] = useState(1);
  const [complete, setComplete] = useState(false);
  const [loading, setLoading] = useState(false);
  const [dbData, setDbData] = useState({
    skills: [],
    categories: []
  });

  React.useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [skillsRes, catsRes] = await Promise.all([
          insforge.database.from('master_skills').select('*').order('name', { ascending: true }),
          insforge.database.from('master_categories').select('*').order('name', { ascending: true })
        ]);

        if (skillsRes.data) {
          setDbData(prev => ({ ...prev, skills: skillsRes.data.map(s => s.name) }));
        }
        if (catsRes.data) {
          setDbData(prev => ({ ...prev, categories: catsRes.data.map(c => c.name) }));
        }
      } catch (err) {
        console.error('Failed to fetch master data:', err);
      }
    };
    fetchMasterData();
  }, []);
  
  // Track confirmation per section
  const [confirmed, setConfirmed] = useState({
    1: false,
    2: false,
    3: false,
    4: false
  });

  const [formData, setFormData] = useState({
    personal: {
      fullName: "",
      dobDay: "", dobMonth: "", dobYear: "",
      gender: "",
      category: "",
      parentGuardianName: "",
      address1: "",
      address2: "",
      state: "",
      district: "",
      pinCode: "",
      annualIncome: "",
      isDifferentlyAbled: false,
      disabilityType: ""
    },
    contact: {
      primaryMobile: "",
      altMobile: "",
      email: "",
      altEmail: ""
    },
    education: [],
    skills: [],
    languages: [],
    experience: []
  });

  const updateFormData = (section, data) => {
    setFormData(prev => ({
      ...prev,
      [section]: typeof data === 'function' ? data(prev[section]) : data
    }));
  };

  const nextStep = () => {
    if (step < 4) setStep(step + 1);
    else handleSubmit();
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await insforge.database
        .from('pm_applications')
        .insert({
          full_name: formData.personal.fullName,
          email: formData.contact.email,
          phone: formData.contact.primaryMobile,
          registration_data: formData
        });

      if (error) {
        throw error;
      }

      setComplete(true);
    } catch (error) {
      console.error('Submission failed:', error);
      alert('Application submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (complete) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="card max-w-md w-full p-12 text-center"
        >
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check size={40} />
          </div>
          <h2 className="text-2xl mb-2">Application Submitted!</h2>
          <p className="text-text-secondary mb-8">Your application for the PM Internship program has been successfully received.</p>
          <button 
            onClick={() => window.location.reload()}
            className="btn-primary w-full"
          >
            Finish
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-6 lg:px-12 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-3xl text-primary mb-2">PM Internship Program</h1>
        <p className="text-text-secondary">National Internship Portal Registration</p>
      </div>

      {/* Progress Bar */}
      <div className="mb-16 relative">
        <div className="flex justify-between items-center mb-4">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex flex-col items-center relative z-10">
              <div 
                className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-400 border-2",
                  step === s ? "bg-accent border-accent text-white" : 
                  step > s ? "bg-primary border-primary text-white" : "bg-white border-border text-text-secondary"
                )}
              >
                {step > s ? <Check size={20} /> : s}
              </div>
              <span className={cn(
                "mt-2 text-[11px] font-bold uppercase tracking-wider",
                step === s ? "text-accent" : "text-text-secondary"
              )}>
                {["Personal", "Contact", "Education", "Skills"][s-1]}
              </span>
            </div>
          ))}
        </div>
        <div className="absolute top-5 left-0 w-full h-0.5 bg-border -z-0">
          <motion.div 
            className="h-full bg-accent"
            animate={{ width: `${((step - 1) / 3) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* Step Router */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
          className="mb-12"
        >
          {step === 1 && <Page1 formData={formData.personal} setFormData={(val) => updateFormData('personal', val)} confirmed={confirmed[1]} setConfirmed={(val) => setConfirmed({...confirmed, 1: val})} categories={dbData.categories} />}
          {step === 2 && <Page2 formData={formData.contact} setFormData={(val) => updateFormData('contact', val)} confirmed={confirmed[2]} setConfirmed={(val) => setConfirmed({...confirmed, 2: val})} />}
          {step === 3 && <Page3 data={formData.education} setData={(val) => updateFormData('education', val)} confirmed={confirmed[3]} setConfirmed={(val) => setConfirmed({...confirmed, 3: val})} />}
          {step === 4 && <Page4 formData={formData} setFormData={setFormData} confirmed={confirmed[4]} setConfirmed={(val) => setConfirmed({...confirmed, 4: val})} masterSkills={dbData.skills} />}
          
          {step === 5 && <FinalReview formData={formData} setStep={setStep} />}
        </motion.div>
      </AnimatePresence>

      {/* Navigation Buttons */}
      {step < 5 && (
        <div className="flex justify-between items-center pt-8 border-t border-border">
          <button 
            onClick={prevStep}
            disabled={step === 1}
            className="btn-ghost flex items-center gap-2 px-0 disabled:opacity-0"
          >
            <ChevronLeft size={20} />
            Back
          </button>
          
          {confirmed[step] ? (
            <button 
              onClick={nextStep}
              className="btn-primary flex items-center gap-2"
            >
              {step === 4 ? "Review All" : "Continue"}
              <ChevronRight size={20} />
            </button>
          ) : (
             <div className="text-text-secondary text-sm italic">Confirm this section to continue</div>
          )}
        </div>
      )}

      {step === 5 && (
        <div className="flex justify-end pt-8 border-t border-border">
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="btn-primary w-full max-w-xs flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : "Submit Application"}
          </button>
        </div>
      )}
    </div>
  );
}

// --- PAGE 1: PERSONAL DETAILS ---

function Page1({ formData, setFormData, confirmed, setConfirmed, categories }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleConfirm = () => {
    const income = parseFloat(formData.annualIncome);
    if (!formData.fullName || !formData.dobDay || !formData.dobMonth || !formData.dobYear || !formData.gender || !formData.category || !formData.address1 || !formData.state || !formData.district || !formData.pinCode || !formData.parentGuardianName || !formData.annualIncome) {
      alert("Please fill all required fields");
      return;
    }
    if (isNaN(income) || income > 700000) {
      alert("Annual income must be 7 Lakhs or below required for this program");
      return;
    }
    setConfirmed(true);
  };

  return (
    <AnimatePresence mode="wait">
      {!confirmed ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="form" className="card p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-3">
              <Label required>Full Name</Label>
              <Input name="fullName" value={formData.fullName} onChange={handleChange} placeholder="As per official documents" />
            </div>

            <div>
              <Label required>Date of Birth</Label>
              <div className="grid grid-cols-3 gap-2">
                <Select name="dobDay" value={formData.dobDay} onChange={handleChange}>
                  <option value="">Day</option>
                  {Array.from({length: 31}, (_, i) => i + 1).map(d => <option key={d} value={d}>{d}</option>)}
                </Select>
                <Select name="dobMonth" value={formData.dobMonth} onChange={handleChange}>
                  <option value="">Month</option>
                  {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((m, i) => <option key={m} value={i+1}>{m}</option>)}
                </Select>
                <Input name="dobYear" value={formData.dobYear} onChange={handleChange} placeholder="YYYY" maxLength={4} />
              </div>
            </div>

            <div>
              <Label required>Gender</Label>
              <div className="flex flex-wrap gap-2">
                {["Male", "Female", "Other"].map(g => (
                  <button 
                    key={g} 
                    type="button"
                    onClick={() => setFormData({ ...formData, gender: g })}
                    className={cn(
                      "px-4 py-2 text-sm border rounded-full transition-all",
                      formData.gender === g ? "bg-primary text-white border-primary" : "bg-white text-text-primary border-border hover:border-text-secondary"
                    )}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label required>Category</Label>
              <Select name="category" value={formData.category} onChange={handleChange}>
                <option value="">Select Category</option>
                {categories.length > 0 ? categories.map(c => <option key={c} value={c}>{c}</option>) : (
                  ["OC (Open Category)", "BC (Backward Classes)", "MBC (Most Backward Classes)", "OBC (Non-Creamy Layer)", "OBC (Creamy Layer)", "SC", "ST", "EWS"].map(c => <option key={c} value={c}>{c}</option>)
                )}
              </Select>
            </div>

            <div className="md:col-span-3 mt-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary opacity-70 mb-4">Parent / Guardian Information</h3>
            </div>

            <div className="md:col-span-3">
              <Label required>Father / Mother / Guardian Name</Label>
              <Input name="parentGuardianName" value={formData.parentGuardianName} onChange={handleChange} placeholder="Enter full name" />
            </div>

            <div className="md:col-span-3 mt-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-text-secondary mb-4 opacity-70">Address Information</h3>
            </div>

            <div className="md:col-span-3">
              <Label required>Address Line 1</Label>
              <Input name="address1" value={formData.address1} onChange={handleChange} />
            </div>
            <div>
              <Label>Address Line 2 (Optional)</Label>
              <Input name="address2" value={formData.address2} onChange={handleChange} />
            </div>
            <div>
              <Label required>State</Label>
              <Select name="state" value={formData.state} onChange={(e) => {
                setFormData({ ...formData, state: e.target.value, district: "" });
              }}>
                <option value="">Select State</option>
                {Object.keys(INDIAN_STATE_DISTRICTS).map(s => <option key={s} value={s}>{s}</option>)}
              </Select>
            </div>
            <div>
              <Label required>District</Label>
              <Select name="district" value={formData.district} onChange={handleChange} disabled={!formData.state}>
                <option value="">Select District</option>
                {formData.state && INDIAN_STATE_DISTRICTS[formData.state]?.map(d => <option key={d} value={d}>{d}</option>)}
              </Select>
            </div>
            <div>
              <Label required>PIN Code</Label>
              <Input name="pinCode" value={formData.pinCode} onChange={handleChange} maxLength={6} />
            </div>

            <div className="md:col-span-3">
              <Label required>Annual Family Income (₹)</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-2 border-r border-border text-text-secondary font-medium">₹</div>
                <Input 
                  name="annualIncome" 
                  value={formData.annualIncome} 
                  onChange={handleChange} 
                  className="pl-12" 
                  placeholder="e.g. 450000"
                  type="number"
                />
              </div>
              <p className="text-[10px] text-text-secondary mt-1">Must be below 7,00,000 per annum</p>
            </div>

            <div className="md:col-span-3 flex items-center gap-4 mt-4">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({...formData, isDifferentlyAbled: !formData.isDifferentlyAbled})}
                  className={cn(
                    "w-12 h-6 rounded-full relative transition-colors duration-200",
                    formData.isDifferentlyAbled ? "bg-accent" : "bg-gray-300"
                  )}
                >
                  <div className={cn(
                    "absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform duration-200",
                    formData.isDifferentlyAbled ? "translate-x-6" : "translate-x-0"
                  )} />
                </button>
                <Label className="mb-0 normal-case text-sm font-medium">Differently Abled?</Label>
              </div>
              {formData.isDifferentlyAbled && (
                <div className="flex-1 max-w-xs animate-in fade-in slide-in-from-left-2 transition-all">
                  <Select name="disabilityType" value={formData.disabilityType} onChange={handleChange}>
                    <option value="">Type of Disability</option>
                    {["Visual", "Hearing", "Locomotor", "Intellectual", "Other"].map(d => <option key={d} value={d}>{d}</option>)}
                  </Select>
                </div>
              )}
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <button onClick={handleConfirm} className="btn-primary">Confirm Personal Details</button>
          </div>
        </motion.div>
      ) : (
        <PreviewCard 
          title="Personal Details" 
          onEdit={() => setConfirmed(false)}
          data={[
            { label: "Full Name", value: formData.fullName },
            { label: "Date of Birth", value: `${formData.dobDay} / ${formData.dobMonth} / ${formData.dobYear}` },
            { label: "Gender", value: formData.gender },
            { label: "Category", value: formData.category },
            { label: "Parent / Guardian", value: formData.parentGuardianName },
            { label: "Annual Income", value: `₹${parseFloat(formData.annualIncome).toLocaleString()}` },
            { label: "Differently Abled", value: formData.isDifferentlyAbled ? `Yes (${formData.disabilityType})` : "No", highlight: formData.isDifferentlyAbled },
            { label: "Address", value: `${formData.address1}, ${formData.address2 ? formData.address2 + ', ' : ''}${formData.district}, ${formData.state} - ${formData.pinCode}` }
          ]}
        />
      )}
    </AnimatePresence>
  );
}

// --- PAGE 2: CONTACT DETAILS ---

function Page2({ formData, setFormData, confirmed, setConfirmed }) {
  const [errors, setErrors] = useState({});

  const validateMobile = (name, value) => {
    if (value && !/^\d{10}$/.test(value)) {
      setErrors(prev => ({ ...prev, [name]: "Must be a 10-digit number" }));
      return false;
    } else {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
      return true;
    }
  };

  const validateEmail = (name, value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors(prev => ({ ...prev, [name]: "Invalid email address" }));
      return false;
    } else {
      setErrors(prev => {
        const newErrs = { ...prev };
        delete newErrs[name];
        return newErrs;
      });
      return true;
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name.includes('Mobile')) validateMobile(name, value);
  };

  const handleConfirm = () => {
    if (!formData.primaryMobile || !formData.email) {
      alert("Please fill required fields");
      return;
    }
    if (Object.keys(errors).length > 0) {
      alert("Please fix validation errors");
      return;
    }
    setConfirmed(true);
  };

  const maskPhone = (phone) => {
    if (!phone) return "";
    return phone.substring(0, 2) + "****" + phone.substring(6);
  };

  return (
    <AnimatePresence mode="wait">
      {!confirmed ? (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} key="form" className="card p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Label required>Primary Mobile Number</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-2 border-r border-border text-text-secondary font-medium">+91</div>
                <Input 
                  name="primaryMobile" 
                  value={formData.primaryMobile} 
                  onChange={handleChange} 
                  className="pl-16 pr-10" 
                  maxLength={10} 
                  placeholder="9876543210"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {formData.primaryMobile.length === 10 && !errors.primaryMobile ? <Check className="text-green-500" size={18} /> : 
                   formData.primaryMobile.length > 0 && errors.primaryMobile ? <X className="text-red-500" size={18} /> : null}
                </div>
              </div>
              {errors.primaryMobile && <p className="text-red-500 text-xs mt-1">{errors.primaryMobile}</p>}
            </div>

            <div>
              <Label>Alternative Mobile Number</Label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pr-2 border-r border-border text-text-secondary font-medium">+91</div>
                <Input name="altMobile" value={formData.altMobile} onChange={handleChange} className="pl-16" maxLength={10} />
              </div>
              {errors.altMobile && <p className="text-red-500 text-xs mt-1">{errors.altMobile}</p>}
            </div>

            <div>
              <Label required>Email Address</Label>
              <div className="relative">
                <Input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  onBlur={(e) => validateEmail('email', e.target.value)}
                  className="pr-10"
                  placeholder="yourname@example.com"
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  {formData.email && !errors.email ? <Check className="text-green-500" size={18} /> : 
                   formData.email && errors.email ? <X className="text-red-500" size={18} /> : null}
                </div>
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <Label>Alternative Email</Label>
              <Input 
                type="email" 
                name="altEmail" 
                value={formData.altEmail} 
                onChange={handleChange} 
                onBlur={(e) => validateEmail('altEmail', e.target.value)}
              />
              {errors.altEmail && <p className="text-red-500 text-xs mt-1">{errors.altEmail}</p>}
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <button onClick={handleConfirm} className="btn-primary">Confirm Contact Details</button>
          </div>
        </motion.div>
      ) : (
        <PreviewCard 
          title="Contact Details" 
          onEdit={() => setConfirmed(false)}
          data={[
            { label: "Primary Mobile", value: `+91 ${maskPhone(formData.primaryMobile)}`, icon: <Phone size={14} className="text-text-secondary" /> },
            { label: "Alternative Mobile", value: formData.altMobile ? `+91 ${maskPhone(formData.altMobile)}` : "None", icon: <Phone size={14} className="text-text-secondary" /> },
            { label: "Email Address", value: formData.email, icon: <Mail size={14} className="text-text-secondary" /> },
            { label: "Alternative Email", value: formData.altEmail || "None", icon: <Mail size={14} className="text-text-secondary" /> }
          ]}
        />
      )}
    </AnimatePresence>
  );
}

// --- PAGE 3: EDUCATION ---

function Page3({ data, setData, confirmed, setConfirmed }) {
  const [editingId, setEditingId] = useState(data.length === 0 ? "new" : null);
  const [currentEntry, setCurrentEntry] = useState({
    id: Math.random().toString(36).substr(2, 9),
    qualification: "", course: "", stream: "", board: "", institute: "", passingYear: "", scoreType: "Percentage", scoreValue: ""
  });

  const handleAdd = () => {
    setCurrentEntry({
      id: Math.random().toString(36).substr(2, 9),
      qualification: "", course: "", stream: "", board: "", institute: "", passingYear: "", scoreType: "Percentage", scoreValue: ""
    });
    setEditingId("new");
  };

  const handleSaveEntry = () => {
    if (!currentEntry.qualification || !currentEntry.course || !currentEntry.board || !currentEntry.institute || !currentEntry.passingYear || !currentEntry.scoreValue) {
      alert("Please fill all required fields in the education entry");
      return;
    }
    
    if (editingId === "new") {
      setData([...data, currentEntry]);
    } else {
      setData(data.map(item => item.id === editingId ? currentEntry : item));
    }
    setEditingId(null);
  };

  const handleEdit = (entry) => {
    setCurrentEntry(entry);
    setEditingId(entry.id);
  };

  const handleDelete = (id) => {
    setData(data.filter(item => item.id !== id));
    if (data.length === 1) setEditingId("new");
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        {data.map((edu) => (
          editingId === edu.id ? (
            <div key={edu.id} className="card p-8 border-accent/20 border-2">
              <EducationForm entry={currentEntry} setEntry={setCurrentEntry} onSave={handleSaveEntry} onCancel={() => setEditingId(null)} />
            </div>
          ) : (
            <div key={edu.id} className="card p-6 flex justify-between items-start">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-primary/5 rounded-lg flex items-center justify-center text-primary">
                  <GraduationCap size={24} />
                </div>
                <div>
                  <h4 className="font-semibold text-lg">{edu.qualification} - {edu.course}</h4>
                  <p className="text-text-secondary text-sm">{edu.institute}, {edu.board}</p>
                  <p className="text-text-secondary text-sm">Class of {edu.passingYear} • {edu.scoreValue} {edu.scoreType}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(edu)} className="p-2 hover:bg-gray-100 rounded-full transition-colors text-text-secondary"><Edit2 size={18} /></button>
                <button onClick={() => handleDelete(edu.id)} className="p-2 hover:bg-red-50 rounded-full transition-colors text-red-400"><Trash2 size={18} /></button>
              </div>
            </div>
          )
        ))}

        {editingId === "new" && (
          <div className="card p-8 border-dashed border-2 border-accent/30">
            <EducationForm entry={currentEntry} setEntry={setCurrentEntry} onSave={handleSaveEntry} onCancel={data.length > 0 ? () => setEditingId(null) : null} isNew />
          </div>
        )}

        {editingId === null && (
          <button 
            onClick={handleAdd}
            className="w-full border-2 border-dashed border-border py-6 rounded-card text-text-secondary hover:border-accent hover:text-accent transition-all flex items-center justify-center gap-2 font-medium"
          >
            <Plus size={20} /> Add Another Qualification
          </button>
        )}
      </div>

      <div className="mt-12 flex justify-end">
        <button 
          disabled={data.length === 0 || editingId !== null} 
          onClick={() => setConfirmed(true)} 
          className="btn-primary"
        >
          Confirm Education Details
        </button>
      </div>
    </div>
  );
}

function EducationForm({ entry, setEntry, onSave, onCancel, isNew }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEntry({ ...entry, [name]: value });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <Label required>Qualification</Label>
        <Select name="qualification" value={entry.qualification} onChange={handleChange}>
          <option value="">Select</option>
          {QUALIFICATIONS.map(q => <option key={q} value={q}>{q}</option>)}
        </Select>
      </div>
      <div>
        <Label required>Course</Label>
        <Select name="course" value={entry.course} onChange={handleChange} disabled={!entry.qualification}>
          <option value="">Select</option>
          {entry.qualification && COURSES[entry.qualification].map(c => <option key={c} value={c}>{c}</option>)}
        </Select>
      </div>
      <div>
        <Label>Stream / Specialization</Label>
        <Input name="stream" value={entry.stream} onChange={handleChange} placeholder="e.g. Computer Science" />
      </div>

      <div className="md:col-span-2">
        <Label required>Board / University</Label>
        <Input name="board" value={entry.board} onChange={handleChange} placeholder="e.g. CBSE or Mumbai University" />
      </div>
      <div>
        <Label required>Institute / School</Label>
        <Input name="institute" value={entry.institute} onChange={handleChange} />
      </div>

      <div>
        <Label required>Year of Passing</Label>
        <Select name="passingYear" value={entry.passingYear} onChange={handleChange}>
          <option value="">Select Year</option>
          {Array.from({length: 30}, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
        </Select>
      </div>
      <div>
        <Label required>Score Type</Label>
        <Select name="scoreType" value={entry.scoreType} onChange={handleChange}>
          {["Percentage", "CGPA", "Grade"].map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
      </div>
      <div>
        <Label required>Score Value</Label>
        <Input name="scoreValue" value={entry.scoreValue} onChange={handleChange} placeholder={entry.scoreType === 'Grade' ? "e.g. A+" : "e.g. 85.5"} />
      </div>

      <div className="md:col-span-3 pt-4 flex justify-end gap-3">
        {onCancel && <button onClick={onCancel} className="btn-ghost">Cancel</button>}
        <button onClick={onSave} className="btn-primary">{isNew ? "Add Qualification" : "Update Entry"}</button>
      </div>
    </div>
  );
}

// --- PAGE 4: SKILLS & EXPERIENCE ---

function Page4({ formData, setFormData, confirmed, setConfirmed, masterSkills }) {
  const [expEditingId, setExpEditingId] = useState(null);
  const [currentExp, setCurrentExp] = useState({
    id: Math.random().toString(36).substr(2, 9),
    organization: "", role: "", type: "Internship", fromMonth: "", fromYear: "", toMonth: "", toYear: "", isCurrent: false, description: ""
  });

  const handleAddExp = () => {
    setCurrentExp({
      id: Math.random().toString(36).substr(2, 9),
      organization: "", role: "", type: "Internship", fromMonth: "", fromYear: "", toMonth: "", toYear: "", isCurrent: false, description: ""
    });
    setExpEditingId("new");
  };

  const handleSaveExp = () => {
    if (!currentExp.organization || !currentExp.role || !currentExp.fromMonth || !currentExp.fromYear) {
      alert("Please fill required fields for experience");
      return;
    }
    if (expEditingId === "new") {
      setFormData({ ...formData, experience: [...formData.experience, currentExp] });
    } else {
      setFormData({ ...formData, experience: formData.experience.map(e => e.id === expEditingId ? currentExp : e) });
    }
    setExpEditingId(null);
  };

  return (
    <div className="space-y-12">
      {/* Skills */}
      <div className="card p-8">
        <h3 className="text-xl mb-6">Mastery & Expertise</h3>
        <div className="space-y-8">
          <TagInput 
            label="Key Skills" 
            limit={20} 
            suggestions={masterSkills.length > 0 ? masterSkills : PREDEFINED_SKILLS} 
            tags={formData.skills} 
            setTags={(tags) => setFormData({...formData, skills: tags})} 
          />
          <TagInput 
            label="Languages Known" 
            limit={10} 
            suggestions={PREDEFINED_LANGUAGES} 
            tags={formData.languages} 
            setTags={(tags) => setFormData({...formData, languages: tags})} 
          />
        </div>
      </div>

      {/* Experience */}
      <div className="card p-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl">Work Experience</h3>
          {!expEditingId && (
            <button onClick={handleAddExp} className="btn-outline flex items-center gap-2 py-1.5 px-3 text-sm">
              <Plus size={16} /> Add Experience
            </button>
          )}
        </div>

        <div className="space-y-4">
          {formData.experience.map((exp) => (
            expEditingId === exp.id ? (
              <div key={exp.id} className="p-6 border-2 border-accent/20 rounded-card">
                <ExperienceForm entry={currentExp} setEntry={setCurrentExp} onSave={handleSaveExp} onCancel={() => setExpEditingId(null)} />
              </div>
            ) : (
              <div key={exp.id} className="p-6 border border-border rounded-card flex gap-4 relative">
                <div className="w-10 h-10 bg-accent/10 text-accent rounded-lg flex items-center justify-center shrink-0">
                  <Briefcase size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-semibold">{exp.role}</h4>
                    <div className="flex gap-2">
                       <button onClick={() => { setCurrentExp(exp); setExpEditingId(exp.id); }} className="text-text-secondary hover:text-accent p-1"><Edit2 size={16} /></button>
                       <button onClick={() => setFormData({...formData, experience: formData.experience.filter(e => e.id !== exp.id)})} className="text-text-secondary hover:text-red-500 p-1"><Trash2 size={16} /></button>
                    </div>
                  </div>
                  <p className="text-text-secondary text-sm">{exp.organization} • {exp.type}</p>
                  <p className="text-text-secondary text-xs mt-1">
                    {exp.fromMonth} {exp.fromYear} — {exp.isCurrent ? "Present" : `${exp.toMonth} ${exp.toYear}`}
                  </p>
                  {exp.description && <p className="text-text-primary text-sm mt-3 opacity-80">{exp.description}</p>}
                </div>
              </div>
            )
          ))}
          
          {expEditingId === "new" && (
            <div className="p-6 border-2 border-dashed border-accent/30 rounded-card">
              <ExperienceForm entry={currentExp} setEntry={setCurrentExp} onSave={handleSaveExp} onCancel={() => setExpEditingId(null)} />
            </div>
          )}

          {formData.experience.length === 0 && !expEditingId && (
            <div className="py-12 text-center border-2 border-dashed border-border rounded-card">
              <p className="text-text-secondary text-sm italic">No experience added yet. Internships and volunteer work count!</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button onClick={() => setConfirmed(true)} className="btn-primary">Save & Review All</button>
      </div>
    </div>
  );
}

function ExperienceForm({ entry, setEntry, onSave, onCancel }) {
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEntry({ ...entry, [name]: type === 'checkbox' ? checked : value });
  };

  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const years = Array.from({length: 10}, (_, i) => new Date().getFullYear() - i);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <Label required>Organization Name</Label>
        <Input name="organization" value={entry.organization} onChange={handleChange} />
      </div>
      <div>
        <Label required>Role / Designation</Label>
        <Input name="role" value={entry.role} onChange={handleChange} />
      </div>
      <div>
        <Label required>Type</Label>
        <Select name="type" value={entry.type} onChange={handleChange}>
          {["Internship", "Full-time", "Part-time", "Freelance", "Volunteer"].map(t => <option key={t} value={t}>{t}</option>)}
        </Select>
      </div>
      <div className="flex items-center gap-3 pt-6">
        <input type="checkbox" id="isCurrent" name="isCurrent" checked={entry.isCurrent} onChange={handleChange} className="w-4 h-4 rounded border-border text-accent focus:ring-accent" />
        <label htmlFor="isCurrent" className="text-sm font-medium">Currently Working Here</label>
      </div>

      <div>
        <Label required>Duration From</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select name="fromMonth" value={entry.fromMonth} onChange={handleChange}>
             <option value="">Month</option>
             {months.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Select name="fromYear" value={entry.fromYear} onChange={handleChange}>
             <option value="">Year</option>
             {years.map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
      </div>

      <div>
        <Label required={!entry.isCurrent}>Duration To</Label>
        <div className="grid grid-cols-2 gap-2">
          <Select name="toMonth" value={entry.toMonth} onChange={handleChange} disabled={entry.isCurrent}>
             <option value="">Month</option>
             {months.map(m => <option key={m} value={m}>{m}</option>)}
          </Select>
          <Select name="toYear" value={entry.toYear} onChange={handleChange} disabled={entry.isCurrent}>
             <option value="">Year</option>
             {years.map(y => <option key={y} value={y}>{y}</option>)}
          </Select>
        </div>
      </div>

      <div className="md:col-span-2">
        <Label>Brief Description (Optional)</Label>
        <textarea 
          name="description" 
          value={entry.description} 
          onChange={handleChange} 
          rows={3} 
          maxLength={200}
          className="w-full p-3 border border-border rounded-input focus:outline-none focus:border-primary bg-white text-sm"
          placeholder="What did you do there?"
        />
        <p className="text-[10px] text-text-secondary text-right mt-1">{entry.description.length}/200</p>
      </div>

      <div className="md:col-span-2 flex justify-end gap-3 pt-2">
        <button onClick={onCancel} className="btn-ghost">Cancel</button>
        <button onClick={onSave} className="btn-primary">Save Experience</button>
      </div>
    </div>
  );
}

// --- SHARED COMPONENTS ---

function PreviewCard({ title, onEdit, data }) {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card p-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-4">
        <button onClick={onEdit} className="btn-outline flex items-center gap-1.5 py-1 px-3 text-xs">
          <Edit2 size={12} /> Edit
        </button>
      </div>
      <h3 className="text-xl text-primary font-bold mb-8 flex items-center gap-2">
        <div className="w-1 bg-accent h-6 rounded-full" />
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
        {data.map((item, i) => (
          <div key={i} className={cn(item.fullWidth ? "md:col-span-2" : "")}>
            <span className="label-text mb-0 opacity-60 flex items-center gap-1.5">
              {item.icon} {item.label}
            </span>
            <p className={cn(
              "text-lg font-medium",
              item.highlight ? "text-accent" : "text-text-primary"
            )}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

function TagInput({ label, limit, suggestions, tags, setTags }) {
  const [input, setInput] = useState("");
  const [showSug, setShowSug] = useState(false);

  const filtered = useMemo(() => {
    if (!input) return [];
    return suggestions.filter(s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)).slice(0, 5);
  }, [input, tags, suggestions]);

  const addTag = (tag) => {
    if (tags.length >= limit) return;
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
    }
    setInput("");
    setShowSug(false);
  };

  return (
    <div className="space-y-2">
      <Label>{label} {limit && <span className="text-text-secondary font-normal lowercase">(Max {limit})</span>}</Label>
      <div className="relative">
        <input 
          type="text"
          className="input-field w-full group-focus:border-primary"
          onFocus={() => setShowSug(true)}
          onBlur={() => setTimeout(() => setShowSug(false), 200)}
          onChange={(e) => setInput(e.target.value)}
          value={input}
          placeholder={tags.length >= limit ? "Maximum reached" : "Type to search..."}
          disabled={tags.length >= limit}
        />
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-text-secondary">
          <ChevronRight className="rotate-90" size={18} />
        </div>
        
        {showSug && (input || !input) && (
          <div className="absolute z-20 w-full mt-1 bg-white border border-border shadow-2xl rounded-input overflow-hidden max-h-60 overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
            {(input ? filtered : suggestions.filter(s => !tags.includes(s))).length > 0 ? (
              (input ? filtered : suggestions.filter(s => !tags.includes(s))).map(s => (
                <button 
                  key={s} 
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent blur before click
                    addTag(s);
                  }}
                  className="w-full text-left px-4 py-2.5 hover:bg-primary/5 hover:text-primary transition-colors text-sm font-medium border-b border-border/50 last:border-0"
                >
                  {s}
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-sm text-text-secondary italic">No matches found</div>
            )}
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mt-4">
        <AnimatePresence>
          {tags.map(tag => (
            <motion.div 
              key={tag}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="chip group"
            >
              {tag}
              <button onClick={() => setTags(tags.filter(t => t !== tag))} className="opacity-60 hover:opacity-100 p-0.5">
                <X size={12} strokeWidth={3} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function FinalReview({ formData, setStep }) {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <div className="inline-flex py-1 px-3 bg-green-50 text-green-700 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-green-100">Almost Done</div>
        <h3 className="text-3xl">Review Application</h3>
        <p className="text-text-secondary mt-2">Please ensure all details are correct before submitting. You can edit any section.</p>
      </div>

      <div className="space-y-6">
        <SectionReview section="Personal" onEdit={() => setStep(1)} items={[
          { label: "Name", value: formData.personal.fullName },
          { label: "Category", value: formData.personal.category },
          { label: "Income", value: `₹${parseFloat(formData.personal.annualIncome).toLocaleString()}` },
          { label: "Location", value: `${formData.personal.district}, ${formData.personal.state}` }
        ]} />
        
        <SectionReview section="Contact" onEdit={() => setStep(2)} items={[
          { label: "Phone", value: formData.contact.primaryMobile },
          { label: "Email", value: formData.contact.email }
        ]} />

        <SectionReview section="Education" onEdit={() => setStep(3)} items={
          formData.education.map(e => ({ label: e.qualification, value: `${e.course} from ${e.institute}` }))
        } />

        <SectionReview section="Skills & Experience" onEdit={() => setStep(4)} items={[
          { label: "Skills", value: formData.skills.join(", ") },
          { label: "Experience", value: `${formData.experience.length} entries added` }
        ]} />
      </div>
    </div>
  );
}

function SectionReview({ section, onEdit, items }) {
  return (
    <div className="card p-6 group hover:border-accent/40 transition-colors">
      <div className="flex justify-between items-center mb-4">
        <h4 className="font-bold text-lg text-primary">{section}</h4>
        <button onClick={onEdit} className="text-accent text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <Edit2 size={14} /> Quick Edit
        </button>
      </div>
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="flex gap-4 text-sm">
            <span className="w-24 text-text-secondary shrink-0">{it.label}:</span>
            <span className="font-medium text-text-primary">{it.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
