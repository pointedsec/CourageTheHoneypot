import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="footer bg-gray-900 text-neutral-content p-10">
        <div className='flex flex-col items-center w-full'>
          <Image src={`/logo.png`} alt='CourageTheHoneypot logo' width={200} height={200}/>
          <p>
            Developed with ❤️ by pointedsec
          </p>
        </div>
    </footer>
  )
}