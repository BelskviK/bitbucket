// src/pages/ProductPage.tsx
import DownButton from "../assets/DownButton.svg";
import CartIcon from "../assets/CartIcon.svg";
import DummyBrand from "../assets/image 6.svg";
export default function ProductPage() {
  return (
    <>
      <div className="px-[100px] bg-grey-200  pt-[30px] pb-[49px] w-full font-poppins font-light text-[14px] leading-[1] tracking-[0%]">
        Listing / Product
      </div>
      <div className="px-[100px]  w-full h-full flex flex-row justify-center items-start">
        <div className="flex flex-col w-[121px] mr-[24px] bg-black items-start justify-start h-auto space-y-[9px]">
          <div className="w-full min-h-[161px] bg-customOrange overflow-hidden">
            <img src="" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="w-full min-h-[161px] bg-customOrange overflow-hidden">
            <img src="" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="w-full min-h-[161px] bg-customOrange overflow-hidden">
            <img src="" alt="" className="w-full h-full object-cover" />
          </div>
          <div className="w-full min-h-[161px] bg-customOrange overflow-hidden">
            <img src="" alt="" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="w-[703px] h-[937px] mr-[168px] bg-customOrange flex items-start justify-center rounded-[10px]">
          <img src="" alt="" />
        </div>

        <div className="w-[704px] h-[907px]   flex flex-col items-start gap-[56px] ">
          {/* {`name`} */}
          <div className="w-full h-[117px]  ">
            <p className="font-poppins font-semibold text-[32px] leading-[1] tracking-[0%] mb-[38px]">
              Kids' Curved Hilfiger Graphic T-Shirt
            </p>
            <p className="font-poppins font-semibold text-[32px] leading-[1] tracking-[0%]">
              $ 25
            </p>
          </div>

          {/* {`size and color filters`} */}
          <div className="w-full h-[348px]   flex flex-col   gap-[56px]">
            <div>
              <p className="font-poppins font-normal text-[16px] leading-[1] tracking-normal mb-[16px] py-1">
                Color: <span>Baby pink</span>
              </p>

              <div className="flex flex-row items-center justify-start">
                <div className="w-[38px] h-[38px] bg-customOrange rounded-full mr-[13px]"></div>
                <div className="active w-[38px] h-[38px] bg-red-500 rounded-full">
                  <div className="w-[48px] h-[48px] border-1 border-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-[6px]  ">
              <p className="font-poppins font-normal text-[16px]  mb-[16px] leading-[1] tracking-normal">
                Size: <span>L</span>
              </p>

              <div className="flex flex-row gap-[10px]">
                {/* Size Box */}
                <div className="w-[70px] h-[42px] flex items-center justify-center border border-gray-300 rounded-[10px] px-[16px] py-[9px]">
                  <button className="font-poppins font-normal text-[16px] leading-[1] tracking-normal">
                    S
                  </button>
                </div>

                <div className="w-[70px] h-[42px] flex items-center justify-center border border-gray-300 rounded-[10px] px-[16px] py-[9px]">
                  <button className="font-poppins font-normal text-[16px] leading-[1] tracking-normal">
                    M
                  </button>
                </div>

                <div className="w-[70px] h-[42px] flex items-center justify-center border border-gray-300 rounded-[10px] px-[16px] py-[9px]">
                  <button className="font-poppins font-normal text-[16px] leading-[1] tracking-normal">
                    L
                  </button>
                </div>
              </div>
            </div>

            <div>
              <p className="font-poppins font-normal text-[16px] leading-[1] tracking-normal mb-[16px] py-1">
                Quantity
              </p>
              <div className="flex flex-row justify-center items-center align-center gap-[12px] border border-gray-300 rounded-[10px] w-[70px] h-[42px]">
                <p>1</p>
                <img src={DownButton} alt="" className="w-[20px] h-[20px]" />
              </div>
            </div>
          </div>

          {/* Add TO CART */}
          <div className="flex justify-center items-center w-full">
            <button className="w-full rounded-[10px] bg-customOrange h-[59px] flex flex-row justify-center items-center align-center gap-[12px]  ">
              <img src={CartIcon} alt="" className="w-[24px] h-[24px]" />
              <p className="  flex justify-center items-center rounded-[10px] font-poppins font-medium text-[18px] leading-[1] tracking-normal text-white">
                Add to cart
              </p>
            </button>
          </div>

          {/* BR LINE */}
          <div className="border-b border-gray-300 w-full"></div>

          {/* Description */}
          <div className="">
            <div className="flex flex-row justify-between items-center mb-[12px]">
              <h3 className="font-poppins font-medium text-[20px] leading-[1] tracking-normal">
                Details
              </h3>
              <img src={DummyBrand} alt="" className="w-[109px] h-[60px]" />
            </div>
            <div>
              <div className=" mb-[24px]">
                <p className="font-poppins font-normal text-[16px] leading-[1] tracking-normal">
                  Brand: <span>Tommy Hilfiger</span>
                </p>
              </div>
              <div className="font-poppins font-normal text-[16px] leading-[24px] tracking-normal">
                This product contains regenerative cotton, which is grown using
                farming methods that seek to improve soil health, watersheds and
                biodiversity.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
