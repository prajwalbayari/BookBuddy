const Card = ({ children, className = '', ...props }) => {
  return (
    <div 
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-900/20 p-6 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;