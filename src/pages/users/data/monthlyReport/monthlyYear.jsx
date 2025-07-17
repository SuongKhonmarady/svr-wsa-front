import MonthlyYearlyReports from '../Components/monthly/MonthlyYearlyReports'

function MonthlyYear() {
    return (
        <div 
            className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed"
            style={{
                backgroundImage: "url('https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
            }}>
            {/* Monthly Yearly Reports Component */}
            <MonthlyYearlyReports />
        </div>
    )
}

export default MonthlyYear
