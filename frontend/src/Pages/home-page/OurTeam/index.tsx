import { assets } from '../../../assets/assets'
import Members from '../partials/Members'
import './OurTeam.css'

const OurTeam = () => {
    return (
        <>
            <section className="our-team" id='our-team'> 
                <div className="container">
                    <div className="inner-our-team">
                        <div className="our-team__title">
                            Our Team
                        </div>
                        <div className="our-team__members">
                            <Members/>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default OurTeam