import React, { useState, useEffect, useContext } from "react";
import ContributionGraph from "./StreakCalendar";
// You can remove ChartJS imports if you aren't using them elsewhere
// import { Chart as ChartJS } from "chart.js/auto"; 
// import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext.jsx";
import EditProfile from "../../Components/EditProfile/EditProfile.jsx";

function DashBoard({ theme }) {
  const { backendUrl, setIsLoggedIn, userData, getUserData } = useContext(AppContext);
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);

  const [groups, setGroups] = useState([]);
  const [streakData, setStreakData] = useState({
    streak: 0,
    maxStreak: 0,
  });

  // --- LEVEL CALCULATION LOGIC ---
  const pointsPerLevel = 300;
  const currentPoints = userData?.points || 0;
  const currentLevel = userData?.level || 1;

  // Points earned within this specific level (0 to 299)
  const pointsInCurrentLevel = currentPoints % pointsPerLevel;
  
  // Percentage calculation for the bar width
  // If points are 0, ensure bar is at least somewhat visible or 0
  const progressPercentage = Math.min(100, Math.max(5, (pointsInCurrentLevel / pointsPerLevel) * 100));

  const isDark = theme === "dark";

  const colors = {
    primary: isDark ? "bg-[#1E1E1E]" : "bg-[#F8F2E7]",
    card: isDark ? "bg-white/10" : "bg-[#EADBC8]/70",
    textPrimary: isDark ? "text-white" : "text-gray-800",
    textSecondary: isDark ? "text-gray-300" : "text-gray-700",
    accent: "from-orange-400 to-pink-500",
    shadow: isDark
      ? "shadow-[0_4px_20px_rgba(255,255,255,0.08)]"
      : "shadow-[0_4px_20px_rgba(0,0,0,0.1)]",
  };

  const handleLogout = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/api/auth/logout`,
        {},
        { withCredentials: true,
          Authorization: `Bearer ${localStorage.getItem(token)}`
         }
      );
      if (data.success) {
        toast.success(data.message || "Logged Out Successfully !");
        setIsLoggedIn(false);
        navigate("/");
      } else {
        toast.error(data.message || "Logout Failed !");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went Wrong !");
    }
  };

  useEffect(() => {
    getUserData();

    const updateUserStreak = async () => {
      try {
        const { data } = await axios.post(
          `${backendUrl}/api/user/updateStreak`,
          {},
          { withCredentials: true,
            Authorization: `Bearer ${localStorage.getItem(token)}`
           }
        );
        if (data.success) {
          setStreakData({
            streak: data.streak?.currentCount || 0,
            startDate: data.streak?.startDate || null,
            lastLoginDate: data.streak?.lastLoginDate || null,
          });
        }
      } catch (error) {
        console.log("Error Updating streak : ", error);
      }
    };

    const fetchGroups = async () => {
      try {
        const { data } = await axios.get(
          `${backendUrl}/api/group/my-groups`,
          { withCredentials: true,
            Authorization: `Bearer ${localStorage.getItem(token)}`
           }
        );
        if (data.success) {
          setGroups(data.groups);
        }
      } catch (err) {
        console.log("Error fetching groups:", err);
      }
    };

    updateUserStreak();
    fetchGroups();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendUrl]);

  const [inputValue, setInputValue] = useState("");
  const [filteredGroups, setFilteredGroups] = useState([]);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  useEffect(() => {
    let tempGroups = [...groups];
    if (inputValue.trim()) {
      const lower = inputValue.toLowerCase();
      tempGroups = tempGroups.filter((g) =>
        g.groupName.toLowerCase().includes(lower)
      );
    }
    setFilteredGroups(tempGroups);
  }, [groups, inputValue]);

  return (
    <div className={`min-h-screen px-8 py-6 transition-colors duration-500 text-gray-200`}>
      <div className="grid grid-cols-[22%_78%] gap-6 h-full pt-5">
        
        {/* SIDEBAR */}
        <aside className={`${colors.card} ${colors.shadow} rounded-2xl p-6 flex flex-col items-center justify-between`}>
          <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-orange-400/60 shadow-lg">
              <img
                src={userData?.profilePic?.url || localStorage.getItem("userProfilePic") || "https://png.pngtree.com/png-vector/20231019/ourmid/pngtree-user-profile-avatar-png-image_10211467.png"}
                alt="Avatar"
                className="object-cover w-full h-full"
              />
            </div>
            <h2 className={`text-2xl font-semibold lily ${colors.textPrimary}`}>
              {userData?.name || "Loading..."}
            </h2>

            <button onClick={() => setShowEditProfile(true)} className="bg-gradient-to-r from-orange-400 to-orange-500 text-white px-5 py-2 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer">
              Edit Profile
            </button>

            {showEditProfile && (
               <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
               <div className="bg-white rounded-xl shadow-xl p-6 w-[90%] max-w-3xl">
                 <div className="absolute top-3 right-3">
                   <button onClick={() => setShowEditProfile(false)} className="px-5 py-2 rounded-xl bg-red-500 hover:bg-red-600 cursor-pointer text-white">X</button>
                 </div>
                 <div className="text-2xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text tracking-wide pb-3">Profile</div>
                 <EditProfile />
               </div>
             </div>
            )}
          </div>

          {/* STATS */}
          <div className="w-full mt-8">
            <hr className="text-gray-400 border-t-2 rounded-4xl" />
            <h3 className={`text-center text-3xl font-semibold m-6 bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>Stats</h3>
            <ul className={`text-lg space-y-4 ${colors.textSecondary}`}>
              <li className="flex items-center gap-3"><i className="fas fa-users text-orange-400"></i> Groups: {groups.length}</li>
              <li className="flex items-center gap-3"><i className="fas fa-phone text-orange-400"></i> Phone: {userData?.phone ? `+91 ${userData.phone}` : <span className="text-red-400 text-sm italic">Not Provided</span>}</li>
              <li className="flex items-center gap-3"><i className="fas fa-trophy text-orange-400"></i> Points: {currentPoints}</li>
              <li className="flex items-center gap-3"><i className="fas fa-award text-orange-400"></i> Level: {currentLevel}</li>
            </ul>
            <div className="flex justify-between mt-8">
              <button onClick={handleLogout} className="bg-red-500 hover:bg-red-600 text-white font-semibold px-5 py-2 rounded-lg transition-all cursor-pointer">Logout</button>
              <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-5 py-2 rounded-lg transition-all cursor-pointer" onClick={() => navigate("/contact")}>Support</button>
            </div>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <section className="flex flex-col gap-6">
          {/* CONTRIBUTION GRAPH */}
          <div className={`${colors.card} ${colors.shadow} rounded-2xl p-6 transition-all`}>
            <ContributionGraph darkMode={theme} streak={streakData.streak} maxStreak={streakData.maxStreak} />
          </div>

          <div className="grid grid-cols-2 gap-6">
            
            {/* --- REPLACED DOUGHNUT WITH PROGRESS BAR CARD --- */}
            <div className={`${colors.card} ${colors.shadow} rounded-2xl flex flex-col justify-center p-8`}>
              
              <div className="flex justify-between items-end mb-4">
                <div>
                    <p className={`${colors.textSecondary} text-sm uppercase tracking-wider font-semibold`}>Current Level</p>
                    <h2 className={`text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent`}>
                        Level {currentLevel}
                    </h2>
                </div>
                <div className="text-right">
                    <p className={`${colors.textSecondary} text-sm font-medium`}>
                        {pointsInCurrentLevel} / {pointsPerLevel} XP
                    </p>
                    <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                        {pointsPerLevel - pointsInCurrentLevel} points to next level
                    </p>
                </div>
              </div>

              {/* THE PROGRESS BAR */}
              <div className="w-full h-6 bg-gray-200/20 rounded-full overflow-hidden relative shadow-inner border border-white/10">
                  {/* The Fill */}
                  <div 
                    className="h-full bg-gradient-to-r from-orange-400 to-pink-500 rounded-full transition-all duration-1000 ease-out relative"
                    style={{ width: `${progressPercentage}%` }}
                  >
                      {/* Shine Effect */}
                      <div className="absolute top-0 left-0 w-full h-full"></div>
                  </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-black/20' : 'bg-white/40'}`}>
                      <p className="text-xs text-gray-400">Total Points</p>
                      <p className={`text-xl font-bold ${colors.textPrimary}`}>{currentPoints}</p>
                  </div>
                  <div className={`p-3 rounded-xl ${isDark ? 'bg-black/20' : 'bg-white/40'}`}>
                      <p className="text-xs text-gray-400">Next Milestone</p>
                      <p className={`text-xl font-bold ${colors.textPrimary}`}>Level {currentLevel + 1}</p>
                  </div>
              </div>

            </div>

            {/* GROUP DETAILS CARD */}
            <div className={`${colors.card} ${colors.shadow} rounded-2xl p-6 flex flex-col`}>
              <h2 className={`text-2xl font-semibold mb-4 text-center bg-gradient-to-r ${colors.accent} bg-clip-text text-transparent`}>
                View Group Details
              </h2>

              <div className="flex items-center justify-between mb-6">
                <div className="relative w-full">
                  {!inputValue && (
                    <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-gray-400">
                      <i className="fas fa-search"></i>
                    </div>
                  )}
                  <input
                    type="text"
                    className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-orange-400 outline-none ${isDark ? "bg-transparent border-gray-700 text-white" : "bg-white border-gray-300 text-gray-800"}`}
                    placeholder="Search Groups"
                    value={inputValue}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-5 justify-items-center overflow-y-auto max-h-[300px] pr-2 scrollbar-thin">
                {filteredGroups.length === 0 ? (
                  <p className="text-gray-400 col-span-2">No groups found</p>
                ) : (
                  filteredGroups.map((g) => (
                    <div
                      key={g.groupId}
                      onClick={() => navigate(`/groups/${g.groupId}`)}
                      className={`w-[150px] text-center py-6 rounded-xl border transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-md ${isDark ? "bg-white/5 border-gray-600 hover:bg-orange-500/20" : "bg-white/70 border-gray-300 hover:bg-orange-100"}`}
                    >
                      <p className={`font-semibold ${isDark ? "text-white" : "text-gray-800"}`}>
                        {g.groupName}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default DashBoard;