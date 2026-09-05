import { type SchemaTypeDefinition } from "sanity";
import {
  priceObject,
  areaObject,
  addressObject,
  phoneRow,
  hoursRow,
  socialRow,
} from "./objects";
import siteSettings from "./siteSettings";
import property from "./property";
import project from "./project";
import service from "./service";
import agent from "./agent";
import newsPost from "./newsPost";
import galleryImage from "./galleryImage";
import testimonial from "./testimonial";
import lead from "./lead";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    priceObject,
    areaObject,
    addressObject,
    phoneRow,
    hoursRow,
    socialRow,
    siteSettings,
    property,
    project,
    service,
    agent,
    newsPost,
    galleryImage,
    testimonial,
    lead,
  ],
};

export default schema;
