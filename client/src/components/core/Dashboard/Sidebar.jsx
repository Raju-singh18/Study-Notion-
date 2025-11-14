// import React, { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import { VscSignOut } from "react-icons/vsc";
// import { sidebarLinks } from "../../../data/dashboard-links";
// import SidebarLink from "./SidebarLink";
// import ConfirmationModal from "../../Common/ConfirmationModal";
// import { logout } from "../../../services/operations/authAPI";

// const Sidebar = () => {
//   const { user, loading: profileLoading } = useSelector((state) => state.profile);
//   const { loading: authLoading } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [confirmationModal, setConfirmationModal] = useState(null);

//   if (profileLoading || authLoading) {
//     return <div className="mt-10 text-white">Loading...</div>;
//   }

//   return (
//     <div className="text-white bg-richblack-800">
//       {/* Desktop Sidebar - static below navbar */}
//       <div
//         className="hidden lg:flex flex-col min-w-[222px] 
//                    h-[calc(100vh-3.5rem)] border-r border-richblack-700 
//                    bg-richblack-800 py-10 fixed top-[3.5rem] left-0"
//       >
//         {/* Links */}
//         <div className="flex flex-col gap-1">
//           {sidebarLinks.map((link) => {
//             if (link.type && user?.accountType !== link.type) return null;
//             return <SidebarLink key={link.id} link={link} iconName={link.icon} />;
//           })}
//         </div>

//         <div className="mx-auto my-6 h-[1px] w-10/12 bg-richblack-600"></div>

//         {/* Settings & Logout */}
//         <div className="flex flex-col mt-auto gap-2">
//           <SidebarLink
//             link={{ name: "Settings", path: "/dashboard/settings" }}
//             iconName="VscSettingsGear"
//           />

//           <button
//             onClick={() =>
//               setConfirmationModal({
//                 text1: "Are You Sure?",
//                 text2: "You will be logged out of your account",
//                 btn1Text: "Logout",
//                 btn2Text: "Cancel",
//                 btn1Handler: () => dispatch(logout(navigate)),
//                 btn2Handler: () => setConfirmationModal(null),
//               })
//             }
//             className="text-sm font-medium text-richblack-300 mx-4 my-2 hover:text-yellow-50 transition-all"
//           >
//             <div className="flex items-center gap-x-2 p-4">
//               <VscSignOut className="text-lg" />
//               <span>Logout</span>
//             </div>
//           </button>
//         </div>
//       </div>

//       {/* Mobile Sidebar */}
//       <div className="flex lg:hidden fixed bottom-0 justify-between items-center px-2 py-1 bg-richblack-900 z-50 w-full">
//         {sidebarLinks.map((link) => {
//           if (link.type && user?.accountType !== link.type) return null;
//           return <SidebarLink key={link.id} link={link} iconName={link.icon} />;
//         })}
//         <SidebarLink
//           link={{ name: "Settings", path: "/dashboard/settings" }}
//           iconName="VscSettingsGear"
//         />
//       </div>

//       {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
//     </div>
//   );
// };

// export default Sidebar;

import React, { useState } from 'react'

import { sidebarLinks } from '../../../data/dashboard-links'
import {logout} from "../../../services/operations/authAPI"
import { useDispatch, useSelector } from 'react-redux'
import SidebarLink from './SidebarLink'
import { useNavigate } from 'react-router-dom'
import {VscSignOut} from "react-icons/vsc"
import ConfirmationModal from '../../Common/ConfirmationModal'
// import { setCourse, setStep } from '../../../slices/courseSlice'


const Sidebar = () => {

    const {user, loading: profileLoading} = useSelector((state) => state.profile);
    const {loading:authLoading} = useSelector((state)=>state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [confirmationModal, setConfirmationModal] = useState(null);

    if(profileLoading || authLoading) {
        return (
            <div className='mt-10'>
                Loading...
            </div>
        )
    }

  return (
    <div className=' text-white bg-richblack-800'>
        <div className='hidden min-w-[222px] flex-col border-r-[1px] border-r-richblack-700 lg:flex
        h-[calc[100vh-3.5rem)] bg-richblack-800 py-10'>

            <div className='flex flex-col'>
                {
                    sidebarLinks.map((link) => {
                        if(link.type && user?.accountType !== link.type) return null;
                        return (
                            <SidebarLink key={link.id}  link={link} iconName={link.icon} />
                        )
                    })}
            </div>

            <div className='mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-600'></div>

            <div className='flex flex-col'>
                    <SidebarLink 
                        link={{name:"Settings", path:"/dashboard/settings"}}
                        iconName="VscSettingsGear"
                    />

                    <button 
                        onClick={ () => setConfirmationModal({
                            text1: "Are You Sure ?",
                            text2: "You will be logged out of your Account",
                            btn1Text: "Logout",
                            btn2Text:"Cancel",
                            btn1Handler: () => dispatch(logout(navigate)),
                            btn2Handler: () => setConfirmationModal(null),
                        })}
                        className='text-sm font-medium text-richblack-300 mx-4 my-4'>

                        <div className='flex items-center gap-x-2 p-4'>
                            <VscSignOut className='text-lg'/>
                            <span>Logout</span>
                        </div>

                    </button>

            </div>

        </div>







        {/* mobile sidebar */}
        <div className='flex lg:hidden fixed bottom-0 justify-between items-center px-2 py-1 bg-richblack-900 z-50 w-full'>
        <div className='flex flex-row gap-1 w-full justify-between'>
                {
                    sidebarLinks.map((link) => {
                        if(link.type && user?.accountType !== link.type) return null;
                        return (
                            <SidebarLink key={link.id}  link={link} iconName={link.icon} />
                        )
                    })}
                    <SidebarLink 
                        link={{name:"Settings", path:"/dashboard/settings"}}
                        iconName="VscSettingsGear"
                    />
            </div>
            

        </div>



      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  )
}

export default Sidebar