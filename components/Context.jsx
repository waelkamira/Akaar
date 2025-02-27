'use client';
import React, { createContext, useReducer } from 'react';

function inputsReducer(currentState, action) {
  switch (action.type) {
    case 'SET_RECIPES':
      return {
        ...currentState, // الاحتفاظ بالحالة الحالية
        allPosts: action?.payload,
      };
    case 'New_POST':
      return {
        ...currentState,
        newPost: action?.payload,
      };
    case 'PROPERTY_TYPE':
      return {
        ...currentState,
        data: {
          ...currentState?.data,
          propertyType: action.payload.propertyType,
          modelName: action.payload.modelName,
        },
      };
    case 'PROPERTY_ROOMS_NUMBER':
      return {
        ...currentState,
        data: {
          ...currentState?.data,
          propertyRoomsNumber: action.payload.propertyRoomsNumber,
          modelName: action.payload.modelName,
        },
      };
    case 'PROPERTY_CITY':
      return {
        ...currentState,
        data: {
          ...currentState?.data,
          propertyCity: action.payload?.propertyCity,
          propertyCityLocation: action.payload.propertyCityLocation,

          modelName: action.payload?.modelName,
        },
      };
    case 'PROPERTY_TOWN':
      return {
        ...currentState,
        data: {
          ...currentState?.data,
          propertyTown: action.payload?.propertyTown,
          propertyCityLocation: action.payload.propertyTownLocation,

          modelName: action.payload?.modelName,
        },
      };
    case 'DELETE_RECIPE':
      return {
        ...currentState,
        deletedRecipe: {
          ...currentState?.data,
          propertyType: action.payload.propertyType,
          modelName: action.payload.modelName,
        },
      };

    case 'ADD_IMAGE':
      return {
        ...currentState,
        addImages: action.payload, // تحديث الصور بالمصفوفة الجديدة
      };

    case 'PROFILE_IMAGE':
      return {
        ...currentState,
        profile_image: { image: action.payload },
      };
    case 'IMAGE_ERROR':
      return {
        ...currentState,
        imageError: action?.payload,
      };
    case 'ACTION':
      return {
        ...currentState,
        action: action?.payload,
      };
    case 'MY_POSTS':
      return {
        ...currentState,
        myPosts: action?.payload,
      };
    case 'LOCATION':
      return {
        ...currentState,
        location: action?.payload,
      };
    case 'CATEGORY':
      return {
        ...currentState,
        category: action?.payload,
      };
    case 'POST_ID':
      return {
        ...currentState,
        postId: action?.payload,
      };
    case 'USED_NEW':
      return {
        ...currentState,
        usedNew: action?.payload,
      };
    case 'BRAND':
      return {
        ...currentState,
        brand: action?.payload,
      };
    case 'CATEGORY_TYPE':
      return {
        ...currentState,
        categoryType: action?.payload,
      };

    default:
      return currentState;
  }
}

export const inputsContext = createContext('');
export function InputsContextProvider({ children }) {
  const [state, dispatch] = useReducer(inputsReducer, {
    data: {},
    addImages: [], // مصفوفة لتخزين روابط الصور
    imageError: {},
    profile_image: {},
    allPosts: [],
    newPost: {},
    deletedRecipe: {},
    deleteFavoritePost: {},
    action: {},
    myPosts: [],
    location: [33.5138, 36.2765],
    category: '',
    postId: '',
    usedNew: '',
    brand: '',
    categoryType: '',
  });
  // console.log('from Context', state);

  return (
    <inputsContext.Provider value={{ ...state, dispatch }}>
      {children}
    </inputsContext.Provider>
  );
}
