import { StyleSheet, Dimensions, Platform } from 'react-native';
import { THEME_CONSTANTS } from '../utils/constants';

const { width, height } = Dimensions.get('window');
const { COLORS, SIZES, SPACING } = THEME_CONSTANTS;

// Global Styles
export const globalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
  },
  containerCentered: {
    flex: 1,
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.MD,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.WHITE,
  },

  // Text Styles
  title: {
    fontSize: SIZES.XXLARGE,
    fontWeight: 'bold',
    color: COLORS.PRIMARY,
    textAlign: 'center',
    marginBottom: SPACING.SM,
  },
  subtitle: {
    fontSize: SIZES.MEDIUM,
    color: COLORS.GRAY,
    textAlign: 'center',
    marginBottom: SPACING.LG,
  },
  heading: {
    fontSize: SIZES.XLARGE,
    fontWeight: 'bold',
    color: COLORS.DARK,
    marginBottom: SPACING.MD,
  },
  subheading: {
    fontSize: SIZES.LARGE,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: SPACING.SM,
  },
  body: {
    fontSize: SIZES.MEDIUM,
    color: COLORS.DARK,
    lineHeight: 20,
  },
  caption: {
    fontSize: SIZES.SMALL,
    color: COLORS.GRAY,
  },
  label: {
    fontSize: SIZES.MEDIUM,
    fontWeight: '600',
    color: COLORS.DARK,
    marginBottom: SPACING.XS,
  },

  // Button Styles
  button: {
    backgroundColor: COLORS.PRIMARY,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.LG,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: COLORS.PRIMARY,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: SIZES.MEDIUM,
    fontWeight: 'bold',
  },
  buttonSecondary: {
    backgroundColor: COLORS.SECONDARY,
  },
  buttonSuccess: {
    backgroundColor: COLORS.SUCCESS,
  },
  buttonDanger: {
    backgroundColor: COLORS.DANGER,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
  },
  buttonOutlineText: {
    color: COLORS.PRIMARY,
  },
  buttonDisabled: {
    backgroundColor: COLORS.GRAY,
    opacity: 0.6,
  },

  // Input Styles
  inputContainer: {
    marginBottom: SPACING.MD,
  },
  input: {
    borderWidth: 2,
    borderColor: COLORS.LIGHT,
    backgroundColor: COLORS.WHITE,
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    borderRadius: 12,
    fontSize: SIZES.MEDIUM,
    color: COLORS.DARK,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  inputFocused: {
    borderColor: COLORS.PRIMARY,
  },
  inputError: {
    borderColor: COLORS.DANGER,
  },

  // Card Styles
  card: {
    backgroundColor: COLORS.WHITE,
    borderRadius: 16,
    padding: SPACING.MD,
    marginVertical: SPACING.SM,
    ...Platform.select({
      ios: {
        shadowColor: COLORS.BLACK,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: COLORS.PRIMARY,
    backgroundColor: '#f0f8ff',
  },

  // List Styles
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.MD,
    paddingHorizontal: SPACING.MD,
    backgroundColor: COLORS.WHITE,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.LIGHT,
  },
  listItemSelected: {
    backgroundColor: '#f0f8ff',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.PRIMARY,
  },

  // Badge Styles
  badge: {
    backgroundColor: COLORS.PRIMARY,
    paddingHorizontal: SPACING.SM,
    paddingVertical: 2,
    borderRadius: 12,
    alignSelf: 'flex-start',
  },
  badgeText: {
    color: COLORS.WHITE,
    fontSize: SIZES.SMALL,
    fontWeight: 'bold',
  },
  badgeSuccess: {
    backgroundColor: COLORS.SUCCESS,
  },
  badgeWarning: {
    backgroundColor: COLORS.WARNING,
  },
  badgeDanger: {
    backgroundColor: COLORS.DANGER,
  },

  // Alert Styles
  alert: {
    padding: SPACING.MD,
    borderRadius: 12,
    marginVertical: SPACING.SM,
  },
  alertSuccess: {
    backgroundColor: '#d4edda',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.SUCCESS,
  },
  alertWarning: {
    backgroundColor: '#fff3cd',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.WARNING,
  },
  alertDanger: {
    backgroundColor: '#f8d7da',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.DANGER,
  },
  alertInfo: {
    backgroundColor: '#d1ecf1',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.INFO,
  },

  // Layout Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowAround: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Spacing Utilities
  mtXs: { marginTop: SPACING.XS },
  mtSm: { marginTop: SPACING.SM },
  mtMd: { marginTop: SPACING.MD },
  mtLg: { marginTop: SPACING.LG },
  mtXl: { marginTop: SPACING.XL },

  mbXs: { marginBottom: SPACING.XS },
  mbSm: { marginBottom: SPACING.SM },
  mbMd: { marginBottom: SPACING.MD },
  mbLg: { marginBottom: SPACING.LG },
  mbXl: { marginBottom: SPACING.XL },

  mlXs: { marginLeft: SPACING.XS },
  mlSm: { marginLeft: SPACING.SM },
  mlMd: { marginLeft: SPACING.MD },
  mlLg: { marginLeft: SPACING.LG },
  mlXl: { marginLeft: SPACING.XL },

  mrXs: { marginRight: SPACING.XS },
  mrSm: { marginRight: SPACING.SM },
  mrMd: { marginRight: SPACING.MD },
  mrLg: { marginRight: SPACING.LG },
  mrXl: { marginRight: SPACING.XL },

  pXs: { padding: SPACING.XS },
  pSm: { padding: SPACING.SM },
  pMd: { padding: SPACING.MD },
  pLg: { padding: SPACING.LG },
  pXl: { padding: SPACING.XL },

  pxXs: { paddingHorizontal: SPACING.XS },
  pxSm: { paddingHorizontal: SPACING.SM },
  pxMd: { paddingHorizontal: SPACING.MD },
  pxLg: { paddingHorizontal: SPACING.LG },
  pxXl: { paddingHorizontal: SPACING.XL },

  pyXs: { paddingVertical: SPACING.XS },
  pySm: { paddingVertical: SPACING.SM },
  pyMd: { paddingVertical: SPACING.MD },
  pyLg: { paddingVertical: SPACING.LG },
  pyXl: { paddingVertical: SPACING.XL },
});

// Screen Specific Styles
export const screenStyles = {
  // Language Screen
  languageScreen: StyleSheet.create({
    container: {
      ...globalStyles.containerCentered,
    },
    languageButton: {
      ...globalStyles.rowBetween,
      backgroundColor: globalStyles.card.backgroundColor,
      padding: SPACING.MD,
      marginVertical: SPACING.XS,
      borderRadius: 12,
      width: '100%',
    },
  }),

  // Login/Signup Screens
  authScreen: StyleSheet.create({
    container: {
      ...globalStyles.container,
      padding: SPACING.LG,
    },
    formContainer: {
      marginTop: SPACING.XL,
    },
    passwordHint: {
      ...globalStyles.caption,
      fontStyle: 'italic',
      marginTop: SPACING.XS,
    },
  }),

  // University Selection
  universityScreen: StyleSheet.create({
    searchContainer: {
      marginBottom: SPACING.MD,
    },
    universityItem: {
      ...globalStyles.card,
      marginVertical: SPACING.XS,
    },
    selectedUniversity: {
      ...globalStyles.cardSelected,
    },
  }),

  // Bus Selection
  busScreen: StyleSheet.create({
    busItem: {
      ...globalStyles.card,
      marginVertical: SPACING.XS,
    },
    selectedBus: {
      ...globalStyles.cardSelected,
    },
    codeContainer: {
      ...globalStyles.card,
      backgroundColor: '#f0f8ff',
    },
  }),

  // Stop Selection
  stopScreen: StyleSheet.create({
    stopItem: {
      ...globalStyles.row,
      padding: SPACING.MD,
      marginVertical: SPACING.XS,
      borderRadius: 12,
    },
    selectedStop: {
      backgroundColor: '#f0f8ff',
      borderLeftWidth: 4,
      borderLeftColor: COLORS.PRIMARY,
    },
    stopIndicator: {
      width: 40,
      alignItems: 'center',
      marginRight: SPACING.MD,
    },
    stopCircle: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: COLORS.LIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: COLORS.GRAY,
    },
    selectedStopCircle: {
      backgroundColor: COLORS.PRIMARY,
      borderColor: COLORS.PRIMARY,
    },
    connectorLine: {
      width: 2,
      height: 20,
      backgroundColor: COLORS.LIGHT,
      marginVertical: 2,
    },
  }),

  // Alarm Setup
  alarmScreen: StyleSheet.create({
    timeItem: {
      ...globalStyles.card,
      marginVertical: SPACING.XS,
    },
    selectedTime: {
      ...globalStyles.cardSelected,
    },
    previewCard: {
      ...globalStyles.alert,
      ...globalStyles.alertSuccess,
    },
  }),

  // Tracking Screen
  trackingScreen: StyleSheet.create({
    map: {
      width: '100%',
      height: height * 0.4,
    },
    infoCard: {
      ...globalStyles.card,
      marginTop: -20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    statusIndicator: {
      ...globalStyles.row,
      justifyContent: 'center',
      marginBottom: SPACING.MD,
    },
    statusDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: SPACING.XS,
    },
  }),

  // Profile Screen
  profileScreen: StyleSheet.create({
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: COLORS.PRIMARY,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      marginBottom: SPACING.MD,
    },
    avatarText: {
      color: COLORS.WHITE,
      fontSize: SIZES.XLARGE,
      fontWeight: 'bold',
    },
    section: {
      marginBottom: SPACING.XL,
    },
    infoGrid: {
      backgroundColor: COLORS.LIGHT,
      padding: SPACING.MD,
      borderRadius: 12,
    },
  }),
};

// Component Specific Styles
export const componentStyles = {
  // Map Components
  map: StyleSheet.create({
    busMarker: {
      backgroundColor: COLORS.PRIMARY,
      padding: 8,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: COLORS.WHITE,
    },
    stopMarker: {
      backgroundColor: COLORS.SUCCESS,
      width: 24,
      height: 24,
      borderRadius: 12,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: COLORS.WHITE,
    },
    universityMarker: {
      backgroundColor: COLORS.SECONDARY,
      padding: 8,
      borderRadius: 20,
      borderWidth: 3,
      borderColor: COLORS.WHITE,
    },
  }),

  // Notification Bell
  notificationBell: StyleSheet.create({
    container: {
      padding: 8,
      marginRight: 10,
    },
    badge: {
      position: 'absolute',
      top: 2,
      right: 2,
      backgroundColor: COLORS.DANGER,
      borderRadius: 10,
      minWidth: 18,
      height: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
  }),

  // Loading Spinner
  loading: StyleSheet.create({
    container: {
      ...globalStyles.containerCentered,
    },
    spinner: {
      color: COLORS.PRIMARY,
    },
  }),
};

// Export all styles
export default {
  global: globalStyles,
  screens: screenStyles,
  components: componentStyles,
};