
export default function FeedBackPage() {

  
  return (
    <div>
      Students Feedback&apos;s page
      <div>
        <h1>
          So for any fixes or  bugs or any feedbacks you can fill the form and submit it to us. We will try to fix it as soon as possible.
          <form className="border flex p-3 flex- col gap-3 ">
            <div className="flex flex-col gap-3 ">
              <label htmlFor="feedback" className="font-bold ">Your Feedback:</label>
              <input type="text" id="feedback" className="width-full" placeholder="Enter your feedback here..." />
              <textarea name="" id=""> h</textarea>
              <input type="text" placeholder='Name' />
              <input type="email" placeholder='Email' />
              <button type="submit">Submit</button>
            </div>
          </form>
        </h1>
      </div>
    </div>
  )
}
