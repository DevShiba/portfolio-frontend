function Loader() {
  return (
    <div className='fixed top-0 left-0 right-0 bottom-0 z-10 flex items-center justify-center pointer-events-auto after:content-[""] after:absolute after:top-0 after:left-0 after:right-0 after:bottom-0 after:-z-10 after:bg-[radial-gradient(circle_at_center,transparent_32%,var(--surface-color)_calc(32%+0.25%))] after:bg-[length:100%_100%] after:bg-[position:50%_50%]'>
      <svg
        className="h-full w-full max-w-full max-h-full"
        width="71.3"
        height="71.4"
        viewBox="0 0 71.3 71.4"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          id="svgGroup"
          strokeLinecap="round"
          fillRule="evenodd"
          fontSize="9pt"
          stroke="#000"
          strokeWidth="0.25mm"
          fill="#f7f7f7"
          style={{ stroke: "#000", strokeWidth: "0.25mm", fill: "#f7f7f7" }}
        >
          <path
            d="M 38.9 71.4 L 31.5 71.4 L 8 8.8 L 7.6 8.8 Q 7.8 10.8 7.95 13.9 Q 8.1 17 8.2 20.65 Q 8.3 24.3 8.3 28.1 L 8.3 71.4 L 0 71.4 L 0 0 L 13.3 0 L 35.3 58.5 L 35.7 58.5 L 58.1 0 L 71.3 0 L 71.3 71.4 L 62.4 71.4 L 62.4 27.5 Q 62.4 24 62.5 20.55 Q 62.6 17.1 62.8 14.05 Q 63 11 63.1 8.9 L 62.7 8.9 L 38.9 71.4 Z"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </div>
  );
}

export default Loader;
