// src\pages\Checkout.tsx
import EnvelopIcon from "../assets/EnvelopeIcon.svg";
import CartCalculator from "../components/CartCalculator";
const cartCount: number = 2;

export default function Checkout() {
  return (
    <div className="px-[100px] flex flex-col justify-center items-center">
      {/* Checkout Title */}
      <div className="font-poppins font-semibold text-[42px] leading-[100%] tracking-[0] text-[#10151F] self-start mt-[84px] mb-[51px]">
        Checkout
      </div>

      <div className="flex flex-row justify-between items-start w-full h-[635px]">
        {/* Left Section - Form */}
        <div className="bg-[#F8F6F7] w-[1129px]  h-full rounded-[16px] py-[78px] px-[47px]">
          <div className="font-poppins font-medium text-[22px] leading-[100%] tracking-[0] text-[#3E424A] mb-[52px]">
            Order details
          </div>

          <form className="space-y-[33px] w-[580px]  ">
            {/* Name + Surname */}
            <div className="flex gap-[20px]">
              <input
                type="text"
                placeholder="Name"
                className="w-full h-[42px] rounded-[8px] border border-[#D9D9D9] bg-white px-4
                font-poppins text-[16px] text-[#10151F] 
                placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] 
                placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A]
                focus:outline-none focus:ring-2 focus:ring-[#10151F]"
              />
              <input
                type="text"
                placeholder="Surname"
                className="w-full h-[42px] rounded-[8px] border border-[#D9D9D9] bg-white px-4
                font-poppins text-[16px] text-[#10151F]
                placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] 
                placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A]
                focus:outline-none focus:ring-2 focus:ring-[#10151F]"
              />
            </div>

            {/* Email */}
            <div className="flex items-center w-full h-[42px] rounded-[8px] border border-[#D9D9D9] bg-white px-4">
              <span className="mr-2 w-[20px] h-[20px]">
                <img src={EnvelopIcon} alt="" />
              </span>
              <input
                type="email"
                placeholder="Email"
                className="flex-1 bg-transparent outline-none 
                font-poppins text-[16px] text-[#10151F]
                placeholder:font-poppins placeholder:font-normal 
                placeholder:text-[14px] placeholder:leading-[100%]
                placeholder:tracking-[0] placeholder:text-[#3E424A]"
              />
            </div>

            {/* Address + Zip */}
            <div className="flex gap-[20px]">
              <input
                type="text"
                placeholder="Address"
                className="w-full h-[42px] rounded-[8px] border border-[#D9D9D9] bg-white px-4
                font-poppins text-[16px] text-[#10151F]
                placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] 
                placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A]
                focus:outline-none focus:ring-2 focus:ring-[#10151F]"
              />
              <input
                type="text"
                placeholder="Zip code"
                className="w-full h-[42px] rounded-[8px] border border-[#D9D9D9] bg-white px-4 
                font-poppins text-[16px] text-[#10151F] 
                placeholder:font-poppins placeholder:font-normal placeholder:text-[14px] 
                placeholder:leading-[100%] placeholder:tracking-[0] placeholder:text-[#3E424A] 
                focus:outline-none focus:ring-2 focus:ring-[#10151F]"
              />
            </div>
          </form>
        </div>

        {/* Right Section - Summary */}
        <div className="  w-[460px] h-full  rounded-[16px] ">
          <CartCalculator cartCount={cartCount} />
        </div>
      </div>
    </div>
  );
}
