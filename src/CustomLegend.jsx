const CustomLegend = () => {
    const legendData = [
        { name: "Coal|Electricity", color: "#1b4448" },
        { name: "Coal|Other", color: "#437574" },
        { name: "Gas|Electricity", color: "#171795" },
        { name: "Gas|Other", color: "#1517ff" },
        { name: "Oil|Electricity", color: "#931917" },
        { name: "Oil|Other", color: "#ad3d3a" },
    ];

    return (
        <div className="flex flex-col lg:flex-col md:flex-row justify-center gap-8 max-lg:mb-10">
            {/* Fossil Use Section */}
            <div className="flex flex-col">
                <h1 className="font-semibold mb-2 text-lg">Fossil use</h1>
                <ul className="flex lg:flex-col flex-row max-lg:flex-wrap gap-2 text-base">
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
                <h1 className="font-semibold mb-2 text-lg">Domestic Supply</h1>
                <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2 text-base">
                        <span className="text-black font-semibold text-lg">--</span>
                        Production
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default CustomLegend;