import { ViewTypes } from "@/enums/product";
import { Product } from "commerce-sdk";

//@ts-ignore
export const getVariantValueSwatch = (product, variationValue) => {
  const { imageGroups = [] } = product;

  const imageGroup = imageGroups
    //@ts-ignore
    .filter(({ viewType }) => viewType === "swatch")
    .find(({ variationAttributes = [] }) => {
      const colorAttribute = variationAttributes.find(
        ({ id }) => id === "color"
      );
      //@ts-ignore
      const colorValues = colorAttribute?.values || [];
      // A single image can represent multiple variation values, so we only need
      // ensure the variation values appears in once of the images represented values.
      //@ts-ignore
      return colorValues.some(({ value }) => value === variationValue);
    });

  return imageGroup?.images?.[0];
};

export const getImageByViewType = (
  imageGroups: Product.ShopperProducts.ImageGroup[],
  filter: ViewTypes
) => {
  return imageGroups.find(({ viewType }) => {
    return viewType === filter;
  });
};
