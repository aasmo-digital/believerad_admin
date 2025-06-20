import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { FiAlignRight, FiArrowLeft } from 'react-icons/fi'

const PageHeader = ({ children }) => {
    const [openSidebar, setOpenSidebar] = useState(false)
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]) // Default to today's date

    const pathName = useLocation().pathname
    let folderName = ""
    let fileName = ""
    if (pathName === "/") {
        folderName = "Dashboard"
        fileName = "Dashboard"
    } else {
        folderName = pathName.split("/")[1]
        fileName = pathName.split("/")[2]
    }

    const handleDateChange = (e) => {
        const date = e.target.value
        setSelectedDate(date)
        if (onDateChange) {
            onDateChange(date) // Notify parent if callback exists
        }
    }
    
    return (
        <div className="page-header">
            <div className="page-header-left d-flex align-items-center">
                <div className="page-header-title">
                    <h5 className="m-b-10 text-capitalize">{folderName}</h5>
                </div>
                <ul className="breadcrumb">
                    <li className="breadcrumb-item"><Link to="/">Home</Link></li>
                    <li className="breadcrumb-item text-capitalize">{fileName}</li>
                </ul>
            </div>
            <div className="page-header-right ms-auto">
                <div className={`page-header-right-items ${openSidebar ? "page-header-right-open" : ""}`}>
                    <div className="d-flex d-md-none">
                        <Link to="#" onClick={() => setOpenSidebar(false)} className="page-header-right-close-toggle">
                            <FiArrowLeft size={16} className="me-2" />
                            <span>Back</span>
                        </Link>
                    </div>
                    {children}
                </div>
                <div className="d-md-none d-flex align-items-center">
                    <Link to="#" onClick={() => setOpenSidebar(true)} className="page-header-right-open-toggle">
                        <FiAlignRight className="fs-20" />
                    </Link>
                </div>
                {/* <div className="page-header-right-toggle d-none d-md-flex">
                    <Link to="#" onClick={() => setOpenSidebar(false)} className="page-header-right-close-toggle">
                        <FiArrowLeft size={16} className="me-2" />
                        <span>Select Date</span>
                    </Link>
                </div> */}
                {/* Select Date Calendar */}
                {/* <div className="col-md-12">
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        className="form-control"
                    />
                </div> */}
            </div>
        </div>
    )
}

export default PageHeader