import { useNavigate } from "react-router-dom";

function CategoryCard({ category }) {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(`/products?category=${category.value}`)}
      className="
        bg-white 
        rounded-xl 
        border border-[#e4dccf]
        py-6
        text-center
        text-[#2F4F3E]
        font-semibold
        hover:bg-[#2F4F3E]
        hover:text-white
        transition
      "
    >
      {category.name}
    </button>
  );
}

export default CategoryCard;
