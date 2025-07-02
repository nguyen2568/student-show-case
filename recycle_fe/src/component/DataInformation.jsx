import CanSVG from "./../assets/cans.svg";
import BottleSVG from "./../assets/bottle.svg";
import EnergySVG from "./../assets/electric.svg";
import LightBulb from "./../assets/lightbulb.svg";
import TV from "./../assets/tv.svg";
import information from "../config/information";

const convertInfo =
    [
        {
            name: "water",
            icon: BottleSVG,
            description: "Water you have saved",
            unit: "Liters",
            number: function (cans, bottles) {
                return information.waterSave(cans, bottles);
            },
            explain: "Recycling One Plastic Bottle Saves ~6x its Volume in Water",
            Details: (
                <p>It&rsquo;s not just oil and energy - making new plastic also uses a lot of water. Producing a new water bottle actually requires about 6 times as much water as the bottle can hold<br />
                    For example, a 1-liter plastic bottle might take roughly 6 liters of water (about 1.5 gallons) to manufacture when you count extraction, processing, and cooling. By recycling that one bottle, you save those 6 liters of water from being wasted on new production. Multiply that by many bottles, and the water savings become substantial. In a world where fresh water is a precious resource, recycling plastic helps conserve water that would otherwise be consumed in manufacturing</p>
            ),
            References: (
                <>
                    <div>
                        <div>References: </div>
                        <a className="text-blue-500" href="https://www.plasticreimagined.org/articles/3-ways-you-can-convince-your-loved-ones-to-recycle/" target="_blank" rel="noopener noreferrer">1. Plasticre Imagined</a>
                    </div>
                </>
            )
        },
        {
            name: "electricity",
            icon: EnergySVG,
            description: "Of electricity you have saved",
            unit: "kWh",
            number: function (cans, bottles) {
                return information.electricitySave(cans, bottles);
            },
            explain: "Recycling one standard PET plastic bottle (≈ 500 mL) saves about 0.36 kWh, One Aluminum Can = ~0.2 kWh saved of electricity",
            Details: (
                <p>Recycling a single aluminum can saves about 95% of the energy needed to make a new can from raw ore<br />
                    In practical terms, that&rsquo;s roughly 0.2&ndash;0.3 kilowatt-hours of electricity saved per can &ndash; enough to run a typical television for around 2 hours or a computer for 3 hours<br />
                    This huge energy savings occurs because producing aluminum from recycled metal is far more efficient than refining it from bauxite ore. Every can you recycle translates into real electricity conserved and less demand on power plants</p>
            ),
            References: (
                <>
                    <div>
                        <div>References: </div>
                        <a className="text-blue-500" href="https://www.plasticsforchange.org/blog/why-is-recycled-plastic-sustainable/" target="_blank" rel="noopener noreferrer">1. Plastic For Change</a> <br />
                        <a className="text-blue-500" href="https://archive.epa.gov/epawaste/conserve/smm/wastewise/web/html/factoid.html/" target="_blank" rel="noopener noreferrer">2. U.S. Environmental Protection Agency</a>
                    </div>
                </>
            )
        },
        {
            name: "lightbulb",
            icon: LightBulb,
            description: "Of lighting a light bulb",
            unit: "hours",
            number: function (cans, bottles) {
                return information.lightbulbSave(cans, bottles);
            },
            explain: "One plastic bottle = enough energy to light a bulb for 6 hours",
            Details: (
                <p>Manufacturing new plastic is energy-intensive, but using recycled plastic cuts that energy use by about one-third<br />
                    In fact, recycling just one plastic bottle can save enough energy to power a 60-watt light bulb for up to 6 hours<br />
                    To put it another way, recycling 10 bottles can save roughly the amount of energy needed to run a laptop computer for over 25 hours<br />
                    By recycling your bottles, you&rsquo;re conserving the electricity that would otherwise be spent making plastic from petroleum &ndash; a direct savings that adds up as you recycle more</p>
            ),
            References: (
                <>
                    <div>
                        <div>References: </div>
                        <a className="text-blue-500" href="https://archive.epa.gov/epawaste/conserve/smm/wastewise/web/html/factoid.html/" target="_blank" rel="">1. U.S. Environmental Protection Agency</a> <br />
                        <a className="text-blue-500" href="https://putitinthebin.org/recycling-facts/" target="_blank" rel="">2. putitinthebin</a> <br />
                        <a className="text-blue-500" href="https://www.epa.gov/recycle/frequent-questions-recycling" target="_blank" rel="">3. U.S. Environmental Protection Agency</a> <br />
                    </div>
                </>
            )
        },
        {
            name: "tv",
            icon: TV,
            description: "Of TV operation",
            unit: "hours",
            number: function (cans, bottles) {
                return information.lightbulbSave(cans, bottles);
            },
            explain: "A plastic bottle recycled saves enough energy to power a TV for 3 hours",
            Details: (
                <p>The amount of energy saved differs by material, but almost all recycling processes achieve significant energy savings compared to virgin material production.
                    For example, recycling of aluminum cans saves 95 percent of the energy required to make the same amount of aluminum from virgin sources. For each can recycled, this is enough energy to run a television or computer for three hours</p>
            ),
            References: (
                <>
                    <div>
                        <div>References: </div>
                        <a className="text-blue-500" href="https://archive.epa.gov/wastes/conserve/tools/localgov/web/html/index-2.html/" target="_blank" rel="">1. U.S. Environmental Protection Agency - Communicating the Benefits of Recycling</a> <br />
                    </div>
                </>
            )
        }
    ]



export default convertInfo;