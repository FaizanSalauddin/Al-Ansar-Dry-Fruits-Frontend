import { useNavigate } from "react-router-dom";

function CategoryCard({ category }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(
      `/products?category=${category.name.toLowerCase()}`
    );
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow cursor-pointer hover:shadow-lg transition"
    >
      <img
        src={category.image || "/category-placeholder.png"}
        alt={category.name}
        className="w-full h-28 object-cover rounded-t-xl"
      />

      <div className="p-3 text-center">
        <h3 className="font-semibold text-[#2F4F3E]">
          {category.name}
        </h3>
      </div>
    </div>
  );
}

export default CategoryCard;
