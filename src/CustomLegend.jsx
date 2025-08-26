const CustomLegend = () => {
    const legendData = [
        { name: "Coal|Electricity", color: "#154a45" },
        { name: "Coal|Other", color: "#457473" },
        { name: "Gas|Electricity", color: "#17159e" },
        { name: "Gas|Other", color: "#1717fc" },
        { name: "Oil|Electricity", color: "#941819" },
        { name: "Oil|Other", color: "#ac3d3e" },
    ];

    return (
        <div className="flex flex-col lg:flex-col md:flex-row justify-center gap-8 max-lg:mb-10">
            {/* Fossil Use Section */}
            <div className="flex flex-col">
                <h1 className="font-semibold mb-2">Fossil use</h1>
                <ul className="flex lg:flex-col flex-row max-lg:flex-wrap gap-2">
                    {legendData.map((item, i) => (
                        <li key={i} className="flex items-center gap-2">
                            <span
                                className="md:h-5 md:w-5 w-3 h-3"
                                style={{ backgroundColor: item.color }}
                            ></span>
                            {item.name}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Domestic Supply Section */}
            <div className="flex flex-col mt-4 lg:mt-2">
                <h1 className="font-semibold mb-2">Domestic Supply</h1>
                <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2">
                        <span className="text-black font-bold text-lg">--</span>
                        Production
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CustomLegend;