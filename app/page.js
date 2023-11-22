import Link from 'next/link'
import Image from 'next/image'
import heroPic from "../public/images/index-hero.jpg"
import profilePic from "../public/images/profile.jpg"

const Index = () => {
  return (
    <>
        <h1 className="text-3xl font-bold underline">
            Hello world!
        </h1>
        <div className="hero">
            <Image src={heroPic} alt="hero" />
            <div className="textContainer">
                <h1>I'm takashi miyagawa!</h1>
                <h3>web Developer</h3>
            </div>
        </div>
        <div className="container mx-auto px-4">
            <div className="profile">
                <div>
                    <h2>JavaScript Nerd</h2>
                    <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>
                </div>
                <div>
                    <Image src={profilePic} alt="hero" />
                </div>
            </div>
            <div className="skills">
                <h2>Skills</h2>
                <div className="grid grid-cols-2 gap-4 place-content-center h-48">
                    <div><img src="/images/aws-logo.png" alt="aws"/><span>aws / 1 years</span></div>
                    <div><img src="/images/terraform.png" alt="terraform"/><span>terraform / 1 years</span></div>
                    <div><img src="/images/gatsby.svg" alt="gatsby"/><span>Gatsby / 3 years</span></div>
                    <div><img src="/images/next.svg" alt="next"/><span>Next.JS / 3 years</span></div>
                    <div><img src="/images/react.svg"alt="react"/><span>React / 5 years</span></div>
                </div>
            </div>
            <div className="ctaButton">
                <Link href="/contact">Make It Happen!</Link>
            </div>
        </div>
    </>
  )
}

export default Index