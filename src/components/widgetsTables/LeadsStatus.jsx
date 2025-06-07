import React from 'react'
import CardHeader from '@/components/shared/CardHeader'
import Pagination from '@/components/shared/Pagination'
import { FiMoreVertical } from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { contactLeadsData } from '@/utils/fackData/contactLeadsData'
import CardLoader from '@/components/shared/CardLoader'
import useCardTitleActions from '@/hooks/useCardTitleActions'

const LeadsStatus = ({ title, progressFullHeight }) => {
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions();

    if (isRemoved) {
        return null;
    }
    return (
        <div className="col-lg-12">
            <div className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                <CardHeader title={title} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />

                <div className="card-body custom-card-action p-0">
                    <div className="table-responsive">
                        <table className="table table-hover mb-0">
                            <thead>
                                <tr className="border-b">
                                    <th>Sr. No</th>
                                    <th>Client Name</th>
                                    <th>Company</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    contactLeadsData.map(({ amount, id, user_email, user_img, user_name, user_status, user_company, badgeColor }, index) => (
                                        <tr key={id}>
                                            <td>{index + 1}</td>
                                            <td>
                                                <div className="d-flex align-items-center gap-3">
                                                    <div className="avatar-image">
                                                        <img src={user_img} alt="" className="img-fluid" />
                                                    </div>
                                                    <div>
                                                        <span className="d-block">{user_name}</span>
                                                        <span className="fs-12 d-block fw-normal text-muted">{user_email}</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <span className="badge bg-gray-200 text-dark">{user_company}</span>
                                            </td>
                                            <td>${amount} USD</td>
                                            <td>
                                                <span className={`badge bg-soft-${badgeColor} text-${badgeColor}`}>{user_status}</span>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>

                        </table>
                    </div>
                </div>
                <div className="card-footer"> <Pagination /></div>
                <CardLoader refreshKey={refreshKey} />
            </div>
        </div>
    )
}

export default LeadsStatus
