/**
 * Auto-generated entity types
 * Contains all CMS collection interfaces in a single file 
 */

/**
 * Collection ID: communitydiscussions
 * Interface for CommunityDiscussions
 */
export interface CommunityDiscussions {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  neoReferenceId?: string;
  /** @wixFieldType text */
  authorId?: string;
  /** @wixFieldType text */
  subject?: string;
  /** @wixFieldType text */
  messageContent?: string;
  /** @wixFieldType datetime */
  postedAt?: Date | string;
}


/**
 * Collection ID: nearearthobjects
 * Interface for NearEarthObjects
 */
export interface NearEarthObjects {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  name?: string;
  /** @wixFieldType text */
  referenceId?: string;
  /** @wixFieldType number */
  estimatedDiameterMin?: number;
  /** @wixFieldType number */
  estimatedDiameterMax?: number;
  /** @wixFieldType number */
  relativeVelocity?: number;
  /** @wixFieldType number */
  missDistance?: number;
  /** @wixFieldType number */
  riskScore?: number;
  /** @wixFieldType boolean */
  isHazardous?: boolean;
  /** @wixFieldType datetime */
  nextCloseApproachDatetime?: Date | string;
}


/**
 * Collection ID: userprofiles
 * Interface for UserProfiles
 */
export interface UserProfiles {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  username?: string;
  /** @wixFieldType text */
  email?: string;
  /** @wixFieldType text */
  userRole?: string;
  /** @wixFieldType text */
  bio?: string;
  /** @wixFieldType text */
  authId?: string;
  /** @wixFieldType image - Contains image URL, render with <Image> component, NOT as text */
  profilePicture?: string;
  /** @wixFieldType datetime */
  registrationDate?: Date | string;
}


/**
 * Collection ID: watchedasteroids
 * Interface for WatchedAsteroids
 */
export interface WatchedAsteroids {
  _id: string;
  _createdDate?: Date;
  _updatedDate?: Date;
  /** @wixFieldType text */
  userId?: string;
  /** @wixFieldType text */
  neoId?: string;
  /** @wixFieldType datetime */
  addedDate?: Date | string;
  /** @wixFieldType boolean */
  customAlertsEnabled?: boolean;
  /** @wixFieldType datetime */
  lastNotificationDate?: Date | string;
  /** @wixFieldType text */
  userNotes?: string;
}
