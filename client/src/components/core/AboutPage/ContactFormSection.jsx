import React from 'react'
import ContactUsForm from '../../ContactPage/ContactUsForm'

const ContactFormSection = () => {
  return (
    <div className="w-full bg-richblack-900 py-16 px-4 lg:px-0 flex flex-col items-center text-center text-richblack-5">
      <h1 className="text-3xl md:text-4xl font-bold mb-4">
        Get in Touch
      </h1>
      <p className="text-sm md:text-base text-richblack-300 max-w-[600px] mb-10">
        We'd love to hear from you! Please fill out the form below and our team will get back to you shortly.
      </p>

      {/* Contact Form */}
      <div className="w-full flex justify-center">
        <ContactUsForm />
      </div>
    </div>
  )
}

export default ContactFormSection
