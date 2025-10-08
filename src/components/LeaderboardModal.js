import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Modal,
  FlatList,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { getLeaderboardData } from '../services/sessionStorage';

const LeaderboardModal = ({ visible, onClose }) => {
  const [leaderboardData, setLeaderboardData] = useState([]);

  useEffect(() => {
    if (visible) {
      loadLeaderboardData();
    }
  }, [visible]);

  const loadLeaderboardData = async () => {
    try {
      const data = await getLeaderboardData();
      // Add rank numbers to the data
      const rankedData = data.map((item, index) => ({
        ...item,
        rank: index + 1
      }));
      setLeaderboardData(rankedData);
    } catch (error) {
      console.error('Error loading leaderboard data:', error);
      setLeaderboardData([]);
    }
  };

  const renderLeaderboardItem = ({ item, index }) => {
    return (
      <View style={styles.leaderboardRow}>
        <Text style={styles.rankText}>{item.rank}</Text>
        <Text style={styles.userNameText}>{item.userName}</Text>
        <Text style={styles.scoreText}>{item.score}</Text>
        <Text style={styles.bestRTText}>{item.bestRT > 0 ? `${item.bestRT}ms` : '— ms'}</Text>
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Leaderboard</Text>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>

          {/* Column Headers */}
          <View style={styles.headerRow}>
            <Text style={styles.headerText}>Rank</Text>
            <Text style={styles.headerText}>User Name</Text>
            <Text style={[styles.headerText, styles.rightAlign]}>Score</Text>
            <Text style={[styles.headerText, styles.rightAlign]}>Best RT</Text>
          </View>

          {/* Separator Line */}
          <View style={styles.separator} />

          {/* Leaderboard List */}
          <FlatList
            data={leaderboardData}
            renderItem={renderLeaderboardItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No scores yet. Be the first!</Text>
              </View>
            }
          />

          {/* Close Button */}
          <TouchableOpacity style={styles.closeButtonBottom} onPress={onClose}>
            <Text style={styles.closeButtonBottomText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: colors.modal,
    borderRadius: 16,
    width: '90%',
    maxHeight: '80%',
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    ...typography.h2,
    fontSize: 24,
  },
  closeButton: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    fontSize: 20,
    color: colors.white,
    fontWeight: 'bold',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  headerText: {
    ...typography.button,
    fontSize: 14,
    flex: 1,
  },
  rightAlign: {
    textAlign: 'right',
  },
  separator: {
    height: 1,
    backgroundColor: colors.gray,
    marginVertical: 8,
  },
  leaderboardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  currentUserRow: {
    backgroundColor: colors.secondary,
    borderRadius: 8,
    marginVertical: 2,
  },
  rankText: {
    ...typography.body,
    fontSize: 14,
    flex: 1,
    textAlign: 'left',
  },
  userNameText: {
    ...typography.body,
    fontSize: 14,
    flex: 2,
    textAlign: 'left',
  },
  scoreText: {
    ...typography.body,
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  bestRTText: {
    ...typography.body,
    fontSize: 14,
    flex: 1,
    textAlign: 'right',
  },
  closeButtonBottom: {
    backgroundColor: colors.blue,
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 40,
    alignSelf: 'center',
    marginTop: 20,
  },
  closeButtonBottomText: {
    ...typography.button,
    color: colors.white,
    fontSize: 16,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    ...typography.body,
    color: colors.gray,
    textAlign: 'center',
  },
});

export default LeaderboardModal;
