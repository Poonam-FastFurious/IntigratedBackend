import Banner from "../Banner/Banner.model.js";
import Product from "../Product/Product.model.js";
import TeamMember from "../TeamMenber/TeamMember.model.js";

export const getDashboardCounts = async (req, res) => {
  try {
    const [bannerCount, productCount, teamCount] = await Promise.all([
      Banner.countDocuments(),
      Product.countDocuments(),
      TeamMember.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        banners: bannerCount,
        products: productCount,
        teamMembers: teamCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard counts",
      error: error.message,
    });
  }
};
