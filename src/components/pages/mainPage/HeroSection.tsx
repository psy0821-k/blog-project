import React from 'react'

const HeroSection = () => {
  return (
    <section className="hero pt-50 pb-50 bg-linear-to-b from-blue-800 from-5% to-blue-600 to-95%">
      <div className="content inner pl-8 pr-8">
        <h2 className="hero-title">
          <p>DEVELOPMENT</p>
          <p>
            <span className="noWrap">
              PLAYGROUND
              <svg
                className="pinwheel"
                viewBox="0 0 100 100"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <g className="pinwheelSpin">
                  <path d="M50 50 L50 6 A22 22 0 0 1 72 28 Z" fill="#fde047" />
                  <path d="M50 50 L94 50 A22 22 0 0 1 72 72 Z" fill="#f97316" />
                  <path d="M50 50 L50 94 A22 22 0 0 1 28 72 Z" fill="#fde047" />
                  <path d="M50 50 L6 50 A22 22 0 0 1 28 28 Z" fill="#f97316" />
                </g>
              </svg>
            </span>
          </p>
        </h2>
      </div>
    </section>
  )
}

export default HeroSection
