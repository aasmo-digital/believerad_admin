import React from 'react'
import ReactApexChart from 'react-apexcharts'
import { paymentRecordChartOption } from '@/utils/chartsLogic/paymentRecordChartOption'
import useCardTitleActions from '@/hooks/useCardTitleActions'
import CardHeader from '@/components/shared/CardHeader'
import CardLoader from '@/components/shared/CardLoader'
import { tasksOverviewChartOption } from '@/utils/chartsLogic/tasksOverviewChatOption'
import getIcon from '@/utils/getIcon'

const PaymentRecordChart = () => {
    const chartOptions = paymentRecordChartOption()
    const { refreshKey, isRemoved, isExpanded, handleRefresh, handleExpand, handleDelete } = useCardTitleActions()

    if (isRemoved) {
        return null
    }

    const overviewInfo = [
        { title: "Total Peak Slots", icon: "feather-star", total_number: "50", completed_number: "22", progress: "28", chartColor: "#3454d1", color: "primary" },
        { title: "Total Normal Slots", icon: "feather-file-text", total_number: "30", completed_number: "5", progress: "34", chartColor: "#25b865", color: "success" },
        { title: "Total Booked Peak Slots", icon: "feather-airplay", total_number: "20", completed_number: "20", progress: "42", chartColor: "#d13b4c", color: "danger" },
    ]

    const data = [44, 55, 41, 60, 52, 66, 51]
    const chartOptionsOverview = tasksOverviewChartOption()

    return (
        <div className="d-flex">
            {/* Graph section */}
            <div className="graph-section col-8 pe-3">
                <div className={`card stretch stretch-full ${isExpanded ? "card-expand" : ""} ${refreshKey ? "card-loading" : ""}`}>
                    <CardHeader title={"Slots Record"} refresh={handleRefresh} remove={handleDelete} expanded={handleExpand} />
                    <div className="card-body custom-card-action p-0">
                        <ReactApexChart
                            options={chartOptions}
                            series={chartOptions.series}
                            height={600}
                        />
                    </div>

                    {/* ✅ Footer Added Here */}
                    <div className="card-footer">
                        <div className="row g-4">
                            <Card bg_color={"bg-primary"} price={"1,240"} progress={"75%"} title={"Peak"} />
                            <Card bg_color={"bg-success"} price={"850"} progress={"60%"} title={"Normal"} />
                            <Card bg_color={"bg-danger"} price={"390"} progress={"30%"} title={"Booked"} />
                            <Card bg_color={"bg-dark"} price={"2,480"} progress={"85%"} title={"Total Revenue"} />
                        </div>
                    </div>

                    <CardLoader refreshKey={refreshKey} />
                </div>
            </div>

            {/* Cards section */}
            <div className="d-flex flex-column gap-2 col-4">
                {overviewInfo.map(({ completed_number, icon, progress, title, total_number, chartColor, color }, index) => (
                    <div key={index} className="card stretch" style={{ width: '100%' }}>
                        <div className="card-header d-flex align-items-center justify-content-between">
                            <div className="d-flex gap-3 align-items-center">
                                <div className="avatar-text">
                                    <i className='fs-16'>{getIcon(icon)}</i>
                                </div>
                                <div>
                                    <div className="fw-semibold text-dark">{title}</div>
                                    <div className="fs-12 text-muted">{completed_number}/{total_number} completed</div>
                                </div>
                            </div>
                            <div className="fs-4 fw-bold text-dark">{completed_number}/{total_number}</div>
                        </div>
                        <div className="card-body d-flex align-items-center justify-content-between gap-4">
                            <ReactApexChart
                                options={{ ...chartOptionsOverview, colors: [chartColor] }}
                                series={[{ name: title, data }]}
                                type='area'
                                height={100}
                            />
                            <div className="fs-12 text-muted text-nowrap">
                                <span className={`fw-semibold text-${color}`}>{progress}% more</span><br />
                                <span>from last week</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default PaymentRecordChart

// ✅ Footer Card Component (same as earlier)
const Card = ({ title, price, progress, bg_color }) => {
    return (
        <div className="col-lg-3">
            <div className="p-3 border border-dashed rounded">
                <div className="fs-12 text-muted mb-1">{title}</div>
                <h6 className="fw-bold text-dark">${price}</h6>
                <div className="progress mt-2 ht-3">
                    <div className={`progress-bar ${bg_color}`} role="progressbar" style={{ width: progress }}></div>
                </div>
            </div>
        </div>
    )
}
